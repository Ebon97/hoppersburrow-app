/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <folly/Conv.h>

#include <array>
#include <istream>

#include <folly/lang/SafeAssert.h>

#include <fast_float/fast_float.h> // @manual=fbsource//third-party/fast_float:fast_float

namespace folly {
namespace detail {

namespace {

/**
 * Finds the first non-digit in a string. The number of digits
 * searched depends on the precision of the Tgt integral. Assumes the
 * string starts with NO whitespace and NO sign.
 *
 * The semantics of the routine is:
 *   for (;; ++b) {
 *     if (b >= e || !isdigit(*b)) return b;
 *   }
 *
 *  Complete unrolling marks bottom-line (i.e. entire conversion)
 *  improvements of 20%.
 */
inline const char* findFirstNonDigit(const char* b, const char* e) {
  for (; b < e; ++b) {
    auto const c = static_cast<unsigned>(*b) - '0';
    if (c >= 10) {
      break;
    }
  }
  return b;
}

// Maximum value of number when represented as a string
template <class T>
struct MaxString {
  static const char* const value;
};

template <>
const char* const MaxString<uint8_t>::value = "255";
template <>
const char* const MaxString<uint16_t>::value = "65535";
template <>
const char* const MaxString<uint32_t>::value = "4294967295";
#if __SIZEOF_LONG__ == 4
template <>
const char* const MaxString<unsigned long>::value = "4294967295";
#else
template <>
const char* const MaxString<unsigned long>::value = "18446744073709551615";
#endif
static_assert(
    sizeof(unsigned long) >= 4,
    "Wrong value for MaxString<unsigned long>::value,"
    " please update.");
template <>
const char* const MaxString<unsigned long long>::value = "18446744073709551615";
static_assert(
    sizeof(unsigned long long) >= 8,
    "Wrong value for MaxString<unsigned long long>::value"
    ", please update.");

#if FOLLY_HAVE_INT128_T
template <>
const char* const MaxString<__uint128_t>::value =
    "340282366920938463463374607431768211455";
#endif

/*
 * Lookup tables that converts from a decimal character value to an integral
 * binary value, shifted by a decimal "shift" multiplier.
 * For all character values in the range '0'..'9', the table at those
 * index locations returns the actual decimal value shifted by the multiplier.
 * For all other values, the lookup table returns an invalid OOR value.
 */
// Out-of-range flag value, larger than the largest value that can fit in
// four decimal bytes (9999), but four of these added up together should
// still not overflow uint16_t.
constexpr int32_t OOR = 10000;

alignas(16) constexpr uint16_t shift1[] = {
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 0-9
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  10
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  20
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  30
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, 0,   1, //  40
    2,   3,   4,   5,   6,   7,   8,   9,   OOR, OOR,
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  60
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  70
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  80
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  90
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 100
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 110
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 120
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 130
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 140
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 150
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 160
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 170
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 180
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 190
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 200
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 210
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 220
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 230
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 240
    OOR, OOR, OOR, OOR, OOR, OOR // 250
};

alignas(16) constexpr uint16_t shift10[] = {
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 0-9
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  10
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  20
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  30
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, 0,   10, //  40
    20,  30,  40,  50,  60,  70,  80,  90,  OOR, OOR,
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  60
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  70
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  80
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  90
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 100
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 110
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 120
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 130
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 140
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 150
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 160
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 170
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 180
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 190
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 200
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 210
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 220
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 230
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 240
    OOR, OOR, OOR, OOR, OOR, OOR // 250
};

alignas(16) constexpr uint16_t shift100[] = {
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 0-9
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  10
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  20
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  30
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, 0,   100, //  40
    200, 300, 400, 500, 600, 700, 800, 900, OOR, OOR,
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  60
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  70
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  80
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, //  90
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 100
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 110
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 120
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 130
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 140
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 150
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 160
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 170
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 180
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 190
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 200
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 210
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 220
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 230
    OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, OOR, // 240
    OOR, OOR, OOR, OOR, OOR, OOR // 250
};

alignas(16) constexpr uint16_t shift1000[] = {
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 0-9
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  10
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  20
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  30
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  0,   1000, //  40
    2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, OOR, OOR,
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  60
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  70
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  80
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, //  90
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 100
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 110
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 120
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 130
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 140
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 150
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 160
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 170
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 180
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 190
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 200
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 210
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 220
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 230
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR,  OOR, OOR, // 240
    OOR,  OOR,  OOR,  OOR,  OOR,  OOR // 250
};

struct ErrorString {
  const char* string;
  bool quote;
};

// Keep this in sync with ConversionCode in Conv.h
constexpr const std::array<
    ErrorString,
    static_cast<std::size_t>(ConversionCode::NUM_ERROR_CODES)>
    kErrorStrings{{
        {"Success", true},
        {"Empty input string", true},
        {"No digits found in input string", true},
        {"Integer overflow when parsing bool (must be 0 or 1)", true},
        {"Invalid value for bool", true},
        {"Non-digit character found", true},
        {"Invalid leading character", true},
        {"Overflow during conversion", true},
        {"Negative overflow during conversion", true},
        {"Unable to convert string to floating point value", true},
        {"Non-whitespace character found after end of conversion", true},
        {"Overflow during arithmetic conversion", false},
        {"Negative overflow during arithmetic conversion", false},
        {"Loss of precision during arithmetic conversion", false},
    }};

// Check if ASCII is really ASCII
using IsAscii =
    std::bool_constant<'A' == 65 && 'Z' == 90 && 'a' == 97 && 'z' == 122>;

// The code in this file that uses tolower() really only cares about
// 7-bit ASCII characters, so we can take a nice shortcut here.
inline char tolower_ascii(char in) {
  return IsAscii::value ? in | 0x20 : char(std::tolower(in));
}

inline bool bool_str_cmp(const char** b, size_t len, const char* value) {
  // Can't use strncasecmp, since we want to ensure that the full value matches
  const char* p = *b;
  const char* e = *b + len;
  const char* v = value;
  while (*v != '\0') {
    if (p == e || tolower_ascii(*p) != *v) { // value is already lowercase
      return false;
    }
    ++p;
    ++v;
  }

  *b = p;
  return true;
}

} // namespace

Expected<bool, ConversionCode> str_to_bool(StringPiece* src) noexcept {
  auto b = src->begin(), e = src->end();
  for (;; ++b) {
    if (b >= e) {
      return makeUnexpected(ConversionCode::EMPTY_INPUT_STRING);
    }
    if ((*b < '\t' || *b > '\r') && *b != ' ') {
      break;
    }
  }

  bool result;
  auto len = size_t(e - b);
  switch (*b) {
    case '0':
    case '1': {
      result = false;
      for (; b < e && isdigit(*b); ++b) {
        if (result || (*b != '0' && *b != '1')) {
          return makeUnexpected(ConversionCode::BOOL_OVERFLOW);
        }
        result = (*b == '1');
      }
      break;
    }
    case 'y':
    case 'Y':
      result = true;
      if (!bool_str_cmp(&b, len, "yes")) {
        ++b; // accept the single 'y' character
      }
      break;
    case 'n':
    case 'N':
      result = false;
      if (!bool_str_cmp(&b, len, "no")) {
        ++b;
      }
      break;
    case 't':
    case 'T':
      result = true;
      if (!bool_str_cmp(&b, len, "true")) {
        ++b;
      }
      break;
    case 'f':
    case 'F':
      result = false;
      if (!bool_str_cmp(&b, len, "false")) {
        ++b;
      }
      break;
    case 'o':
    case 'O':
      if (bool_str_cmp(&b, len, "on")) {
        result = true;
      } else if (bool_str_cmp(&b, len, "off")) {
        result = false;
      } else {
        return makeUnexpected(ConversionCode::BOOL_INVALID_VALUE);
      }
      break;
    default:
      return makeUnexpected(ConversionCode::BOOL_INVALID_VALUE);
  }

  src->assign(b, e);

  return result;
}

/// Uses `fast_float::from_chars` to convert from string to an integer.
template <class Tgt>
Expected<Tgt, ConversionCode> str_to_floating_fast_float_from_chars(
    StringPiece* src) noexcept {
  if (src->empty()) {
    return makeUnexpected(ConversionCode::EMPTY_INPUT_STRING);
  }

  // move through leading whitespace characters
  auto* e = src->end();
  auto* b = std::find_if_not(src->begin(), e, [](char c) {
    return (c >= '\t' && c <= '\r') || c == ' ';
  });
  if (b == e) {
    return makeUnexpected(ConversionCode::EMPTY_INPUT_STRING);
  }

  if (*b == '+') {
    // This function supports a leading + sign, but fast_float does not.
    b += 1;
    if (b == e || (!std::isdigit(*b) && *b != '.')) {
      return makeUnexpected(ConversionCode::STRING_TO_FLOAT_ERROR);
    }
  }

  Tgt result;
  auto [ptr, ec] = fast_float::from_chars(b, e, result);
  bool isOutOfRange{ec == std::errc::result_out_of_range};
  bool isOk{ec == std::errc()};
  if (!isOk && !isOutOfRange) {
    return makeUnexpected(ConversionCode::STRING_TO_FLOAT_ERROR);
  }

  auto numMatchedChars = ptr - src->data();
  src->advance(numMatchedChars);

  if (isOutOfRange) {
    if (*b == '-') {
      return -std::numeric_limits<Tgt>::infinity();
    } else {
      return std::numeric_limits<Tgt>::infinity();
    }
  }

  return result;
}

template Expected<float, ConversionCode>
str_to_floating_fast_float_from_chars<float>(StringPiece* src) noexcept;
template Expected<double, ConversionCode>
str_to_floating_fast_float_from_chars<double>(StringPiece* src) noexcept;

/**
 * StringPiece to double, with progress information. Alters the
 * StringPiece parameter to munch the already-parsed characters.
 */
template <class Tgt>
Expected<Tgt, ConversionCode> str_to_floating(StringPiece* src) noexcept {
  return detail::str_to_floating_fast_float_from_chars<Tgt>(src);
}

template Expected<float, ConversionCode> str_to_floating<float>(
    StringPiece* src) noexcept;
template Expected<double, ConversionCode> str_to_floating<double>(
    StringPiece* src) noexcept;

namespace {

/**
 * This class takes care of additional processing needed for signed values,
 * like leading sign character and overflow checks.
 */
template <typename T, bool IsSigned = is_signed_v<T>>
class SignedValueHandler;

template <typename T>
class SignedValueHandler<T, true> {
 public:
  ConversionCode init(const char*& b) {
    negative_ = false;
    if (!std::isdigit(*b)) {
      if (*b == '-') {
        negative_ = true;
      } else if (FOLLY_UNLIKELY(*b != '+')) {
        return ConversionCode::INVALID_LEADING_CHAR;
      }
      ++b;
    }
    return ConversionCode::SUCCESS;
  }

  ConversionCode overflow() {
    return negative_ ? ConversionCode::NEGATIVE_OVERFLOW
                     : ConversionCode::POSITIVE_OVERFLOW;
  }

  template <typename U>
  Expected<T, ConversionCode> finalize(U value) {
    T rv;
    if (negative_) {
      FOLLY_PUSH_WARNING
      FOLLY_MSVC_DISABLE_WARNING(4146)

      // unary minus operator applied to unsigned type, result still unsigned
      rv = T(-value);

      FOLLY_POP_WARNING

      if (FOLLY_UNLIKELY(rv > 0)) {
        return makeUnexpected(ConversionCode::NEGATIVE_OVERFLOW);
      }
    } else {
      rv = T(value);
      if (FOLLY_UNLIKELY(rv < 0)) {
        return makeUnexpected(ConversionCode::POSITIVE_OVERFLOW);
      }
    }
    return rv;
  }

 private:
  bool negative_;
};

// For unsigned types, we don't need any extra processing
template <typename T>
class SignedValueHandler<T, false> {
 public:
  ConversionCode init(const char*&) { return ConversionCode::SUCCESS; }

  ConversionCode overflow() { return ConversionCode::POSITIVE_OVERFLOW; }

  Expected<T, ConversionCode> finalize(T value) { return value; }
};

} // namespace

/**
 * String represented as a pair of pointers to char to signed/unsigned
 * integrals. Assumes NO whitespace before or after, and also that the
 * string is composed entirely of digits (and an optional sign only for
 * signed types). String may be empty, in which case digits_to returns
 * an appropriate error.
 */
template <class Tgt>
inline Expected<Tgt, ConversionCode> digits_to(
    const char* b, const char* const e) noexcept {
  using UT = make_unsigned_t<Tgt>;
  assert(b <= e);

  SignedValueHandler<Tgt> sgn;

  auto err = sgn.init(b);
  if (FOLLY_UNLIKELY(err != ConversionCode::SUCCESS)) {
    return makeUnexpected(err);
  }

  auto size = size_t(e - b);

  /* Although the string is entirely made of digits, we still need to
   * check for overflow.
   */
  if (size > std::numeric_limits<UT>::digits10) {
    // Leading zeros?
    if (b < e && *b == '0') {
      for (++b;; ++b) {
        if (b == e) {
          return Tgt(0); // just zeros, e.g. "0000"
        }
        if (*b != '0') {
          size = size_t(e - b);
          break;
        }
      }
    }
    if (size > std::numeric_limits<UT>::digits10 &&
        (size != std::numeric_limits<UT>::digits10 + 1 ||
         strncmp(b, MaxString<UT>::value, size) > 0)) {
      return makeUnexpected(sgn.overflow());
    }
  }

  // Here we know that the number won't overflow when
  // converted. Proceed without checks.

  UT result = 0;

  for (; e - b >= 4; b += 4) {
    result *= UT(10000);
    const int32_t r0 = shift1000[static_cast<size_t>(b[0])];
    const int32_t r1 = shift100[static_cast<size_t>(b[1])];
    const int32_t r2 = shift10[static_cast<size_t>(b[2])];
    const int32_t r3 = shift1[static_cast<size_t>(b[3])];
    const auto sum = r0 + r1 + r2 + r3;
    if (sum >= OOR) {
      goto outOfRange;
    }
    result += UT(sum);
  }

  switch (e - b) {
    case 3: {
      const int32_t r0 = shift100[static_cast<size_t>(b[0])];
      const int32_t r1 = shift10[static_cast<size_t>(b[1])];
      const int32_t r2 = shift1[static_cast<size_t>(b[2])];
      const auto sum = r0 + r1 + r2;
      if (sum >= OOR) {
        goto outOfRange;
      }
      result = UT(1000 * result + sum);
      break;
    }
    case 2: {
      const int32_t r0 = shift10[static_cast<size_t>(b[0])];
      const int32_t r1 = shift1[static_cast<size_t>(b[1])];
      const auto sum = r0 + r1;
      if (sum >= OOR) {
        goto outOfRange;
      }
      result = UT(100 * result + sum);
      break;
    }
    case 1: {
      const int32_t sum = shift1[static_cast<size_t>(b[0])];
      if (sum >= OOR) {
        goto outOfRange;
      }
      result = UT(10 * result + sum);
      break;
    }
    default:
      assert(b == e);
      if (size == 0) {
        return makeUnexpected(ConversionCode::NO_DIGITS);
      }
      break;
  }

  return sgn.finalize(result);

outOfRange:
  return makeUnexpected(ConversionCode::NON_DIGIT_CHAR);
}

template Expected<char, ConversionCode> digits_to<char>(
    const char*, const char*) noexcept;
template Expected<signed char, ConversionCode> digits_to<signed char>(
    const char*, const char*) noexcept;
template Expected<unsigned char, ConversionCode> digits_to<unsigned char>(
    const char*, const char*) noexcept;

template Expected<short, ConversionCode> digits_to<short>(
    const char*, const char*) noexcept;
template Expected<unsigned short, ConversionCode> digits_to<unsigned short>(
    const char*, const char*) noexcept;

template Expected<int, ConversionCode> digits_to<int>(
    const char*, const char*) noexcept;
template Expected<unsigned int, ConversionCode> digits_to<unsigned int>(
    const char*, const char*) noexcept;

template Expected<long, ConversionCode> digits_to<long>(
    const char*, const char*) noexcept;
template Expected<unsigned long, ConversionCode> digits_to<unsigned long>(
    const char*, const char*) noexcept;

template Expected<long long, ConversionCode> digits_to<long long>(
    const char*, const char*) noexcept;
template Expected<unsigned long long, ConversionCode>
digits_to<unsigned long long>(const char*, const char*) noexcept;

#if FOLLY_HAVE_INT128_T
template Expected<__int128, ConversionCode> digits_to<__int128>(
    const char*, const char*) noexcept;
template Expected<unsigned __int128, ConversionCode>
digits_to<unsigned __int128>(const char*, const char*) noexcept;
#endif

/**
 * StringPiece to integrals, with progress information. Alters the
 * StringPiece parameter to munch the already-parsed characters.
 */
template <class Tgt>
Expected<Tgt, ConversionCode> str_to_integral(StringPiece* src) noexcept {
  using UT = make_unsigned_t<Tgt>;

  auto b = src->data(), past = src->data() + src->size();

  for (;; ++b) {
    if (FOLLY_UNLIKELY(b >= past)) {
      return makeUnexpected(ConversionCode::EMPTY_INPUT_STRING);
    }
    if ((*b < '\t' || *b > '\r') && *b != ' ') {
      break;
    }
  }

  SignedValueHandler<Tgt> sgn;
  auto err = sgn.init(b);

  if (FOLLY_UNLIKELY(err != ConversionCode::SUCCESS)) {
    return makeUnexpected(err);
  }
  if (is_signed_v<Tgt> && FOLLY_UNLIKELY(b >= past)) {
    return makeUnexpected(ConversionCode::NO_DIGITS);
  }
  if (FOLLY_UNLIKELY(!isdigit(*b))) {
    return makeUnexpected(ConversionCode::NON_DIGIT_CHAR);
  }

  auto m = findFirstNonDigit(b + 1, past);

  auto tmp = digits_to<UT>(b, m);

  if (FOLLY_UNLIKELY(!tmp.hasValue())) {
    return makeUnexpected(
        tmp.error() == ConversionCode::POSITIVE_OVERFLOW ? sgn.overflow()
                                                         : tmp.error());
  }

  auto res = sgn.finalize(tmp.value());

  if (res.hasValue()) {
    src->advance(size_t(m - src->data()));
  }

  return res;
}

template Expected<char, ConversionCode> str_to_integral<char>(
    StringPiece* src) noexcept;
template Expected<signed char, ConversionCode> str_to_integral<signed char>(
    StringPiece* src) noexcept;
template Expected<unsigned char, ConversionCode> str_to_integral<unsigned char>(
    StringPiece* src) noexcept;

template Expected<short, ConversionCode> str_to_integral<short>(
    StringPiece* src) noexcept;
template Expected<unsigned short, ConversionCode>
str_to_integral<unsigned short>(StringPiece* src) noexcept;

template Expected<int, ConversionCode> str_to_integral<int>(
    StringPiece* src) noexcept;
template Expected<unsigned int, ConversionCode> str_to_integral<unsigned int>(
    StringPiece* src) noexcept;

template Expected<long, ConversionCode> str_to_integral<long>(
    StringPiece* src) noexcept;
template Expected<unsigned long, ConversionCode> str_to_integral<unsigned long>(
    StringPiece* src) noexcept;

template Expected<long long, ConversionCode> str_to_integral<long long>(
    StringPiece* src) noexcept;
template Expected<unsigned long long, ConversionCode>
str_to_integral<unsigned long long>(StringPiece* src) noexcept;

#if FOLLY_HAVE_INT128_T
template Expected<__int128, ConversionCode> str_to_integral<__int128>(
    StringPiece* src) noexcept;
template Expected<unsigned __int128, ConversionCode>
str_to_integral<unsigned __int128>(StringPiece* src) noexcept;
#endif

#if defined(FOLLY_CONV_AVALIABILITY_TO_CHARS_FLOATING_POINT) && \
    FOLLY_CONV_AVALIABILITY_TO_CHARS_FLOATING_POINT == 1
DtoaFlagsSet::DtoaFlagsSet(DtoaFlags flags) : flags_(flags) {}

bool DtoaFlagsSet::isSet(DtoaFlags flag) const {
  return (flags_ & flag) == flag;
}

bool DtoaFlagsSet::emitPositiveExponentSign() const {
  return isSet(DtoaFlags::EMIT_POSITIVE_EXPONENT_SIGN);
}

bool DtoaFlagsSet::emitTrailingDecimalPoint() const {
  return isSet(DtoaFlags::EMIT_TRAILING_DECIMAL_POINT);
}

bool DtoaFlagsSet::emitTrailingZeroAfterPoint() const {
  return isSet(DtoaFlags::EMIT_TRAILING_ZERO_AFTER_POINT);
}

bool DtoaFlagsSet::uniqueZero() const {
  return isSet(DtoaFlags::UNIQUE_ZERO);
}

bool DtoaFlagsSet::noTrailingZero() const {
  return isSet(DtoaFlags::NO_TRAILING_ZERO);
}

int ParsedDecimal::numPrecisionFigures() const {
  int numInts = 0;

  bool intIsZero = true;
  int numLeadingIntZeros = 0;
  bool isLeadingIntZero = true;
  for (char* p = integerBegin; p && p != integerEnd; p++) {
    if (*p == '0') {
      if (isLeadingIntZero) {
        numLeadingIntZeros += 1;
      } else {
        numInts += 1;
      }
    } else if (std::isdigit(*p)) {
      intIsZero = false;
      isLeadingIntZero = false;
      numInts += 1;
    } else {
      folly::throw_exception<std::runtime_error>("non-numeric int");
    }
  }

  bool fractionalIsZero = true;
  int numFractional = 0;
  int numLeadingFractionalZeros = 0;
  bool isLeadingFractionalZero = true;
  for (char* p = fractionalBegin; p && p != fractionalEnd; p++) {
    if (*p == '0') {
      if (isLeadingFractionalZero) {
        numLeadingFractionalZeros += 1;
      } else {
        numFractional += 1;
      }
    } else if (std::isdigit(*p)) {
      fractionalIsZero = false;
      isLeadingFractionalZero = false;
      numFractional += 1;
    } else {
      folly::throw_exception<std::runtime_error>("non-numeric frac");
    }
  }

  if (intIsZero && fractionalIsZero) {
    return numLeadingIntZeros + numLeadingFractionalZeros;
  } else if (intIsZero) {
    return numLeadingFractionalZeros + numFractional;
  } else if (fractionalIsZero) {
    return numInts + numLeadingFractionalZeros + numFractional;
  } else {
    return numInts + numLeadingFractionalZeros + numFractional;
  }
}

std::optional<detail::ParsedDecimal::FractionalSuffix>
ParsedDecimal::fractionalSuffix() const {
  if (exponentSymbol) {
    if (exponentEnd) {
      return std::make_pair(exponentSymbol, exponentEnd);
    } else if (exponentSign) {
      return std::make_pair(exponentSymbol, exponentSign);
    } else {
      return std::make_pair(exponentSymbol, exponentSymbol + 1);
    }
  } else if (exponentSign) {
    if (exponentEnd) {
      return std::make_pair(exponentSign, exponentEnd);
    } else {
      return std::make_pair(exponentSign, exponentSign + 1);
    }
  } else if (exponentBegin) {
    if (exponentEnd) {
      return std::make_pair(exponentEnd, exponentEnd);
    } else {
      return std::make_pair(exponentBegin, exponentSign + 1);
    }
  } else {
    return std::nullopt;
  }
}

void ParsedDecimal::shiftFractionalSuffixPtrs(size_t amount) {
  if (exponentSymbol) {
    exponentSymbol += amount;
  }
  if (exponentSign) {
    exponentSign += amount;
  }
  if (exponentBegin) {
    exponentBegin += amount;
  }
  if (exponentEnd) {
    exponentEnd += amount;
  }
}

namespace {

struct Stream : std::istream {
  struct CharBuf : std::streambuf {
    CharBuf(char* begin, char* end) { setg(begin, begin, end); }

    char* pos() const { return gptr(); }
  };
  CharBuf& buf_;

  explicit Stream(CharBuf& buf) : std::istream(&buf), buf_(buf) {}

  char* pos() { return buf_.pos(); }

  void advance() { get(); }
};

} // namespace

ParsedDecimal::ParsedDecimal(char* begin, char* end) {
  if (!begin || !end || begin >= end) {
    folly::throw_exception<std::invalid_argument>("invalid args");
  }

  Stream::CharBuf buf(begin, end);
  Stream stream(buf);
  if (stream.peek() == '-') {
    negativeSign = stream.pos();
    stream.advance();
  }

  if (char c = stream.peek(); std::isdigit(c)) {
    integerBegin = stream.pos();

    while (!stream.eof() && std::isdigit(stream.peek())) {
      stream.advance();
    }

    integerEnd = stream.pos();
  }

  if (stream.eof()) {
    if (!integerBegin) {
      folly::throw_exception<std::invalid_argument>("no int part");
    }

    return;
  }

  if (stream.peek() == '.') {
    decimalPoint = stream.pos();
    stream.advance();
  }

  if (stream.eof()) {
    if (!integerBegin) {
      folly::throw_exception<std::invalid_argument>("no int part");
    }
    return;
  }

  if (char c = stream.peek(); std::isdigit(c)) {
    fractionalBegin = stream.pos();

    while (!stream.eof() && std::isdigit(stream.peek())) {
      stream.advance();
    }

    fractionalEnd = stream.pos();
  }

  if (!integerBegin && !fractionalBegin) {
    // there was no integer or fractional part.
    folly::throw_exception<std::invalid_argument>("no int or frac part");
  }

  if (stream.eof()) {
    return;
  }

  if (stream.peek() == 'e') {
    exponentSymbol = stream.pos();
    stream.advance();

    if (stream.eof()) {
      return;
    }

    if (char c = stream.peek(); c == '-' || c == '+') {
      exponentSign = stream.pos();
      stream.advance();
    }

    if (char c = stream.peek(); std::isdigit(c)) {
      exponentBegin = stream.pos();
      while (!stream.eof() && std::isdigit(stream.peek())) {
        stream.advance();
      }

      exponentEnd = stream.pos();
    }
  }

  while (!stream.eof()) {
    int c = stream.get();
    if (c != '\0' && !std::isspace(c)) {
      folly::throw_exception<std::invalid_argument>("unexpected chars");
    }
  }
}

std::pair<char*, char*> formatAsDoubleConversion(
    bool valueIsZero,
    DtoaMode mode,
    unsigned int numDigits,
    DtoaFlags flags,
    char* resultBegin,
    char* resultEnd,
    char* bufferEnd) {
  detail::ParsedDecimal parsedDecimal(resultBegin, resultEnd);
  detail::DtoaFlagsSet flagsSet{flags};
  if (parsedDecimal.negativeSign && flagsSet.uniqueZero() && valueIsZero) {
    // skip the negative sign (-) if it's a zero and UNIQUE_ZERO is set
    resultBegin += 1;
  }

  unsigned int numTrailingZerosToAdd = 0;
  if (!flagsSet.noTrailingZero() && mode == DtoaMode::PRECISION) {
    // std::to_chars outputs no trailing zeros, so if it's not set, add
    // trailing zeros
    unsigned int numPrecisionFigures = parsedDecimal.numPrecisionFigures();
    if (numDigits > numPrecisionFigures) {
      numTrailingZerosToAdd = numDigits - numPrecisionFigures;
    }
  }

  bool insertDecimalPoint = false;
  char* insertionPoint;
  if (parsedDecimal.fractionalEnd) {
    insertionPoint = parsedDecimal.fractionalEnd;
  } else if (parsedDecimal.decimalPoint) {
    insertionPoint = parsedDecimal.decimalPoint + 1;
  } else {
    insertionPoint = parsedDecimal.integerEnd;
    if (flagsSet.emitTrailingDecimalPoint() || numTrailingZerosToAdd > 0) {
      insertDecimalPoint = true;
    }

    if (flagsSet.emitTrailingZeroAfterPoint()) {
      numTrailingZerosToAdd += 1;
    }
  }

  unsigned int numCharsToInsert =
      numTrailingZerosToAdd + (insertDecimalPoint ? 1 : 0);

  if (numCharsToInsert > 0) {
    if (resultEnd + numCharsToInsert > bufferEnd) {
      folly::throw_exception<std::invalid_argument>("buffer too small");
    }

    std::optional<detail::ParsedDecimal::FractionalSuffix> fractionalsuffix =
        parsedDecimal.fractionalSuffix();
    if (fractionalsuffix.has_value()) {
      auto [fractionalSuffixBegin, fractionalSuffixEnd] = *fractionalsuffix;
      std::memmove(
          insertionPoint + numCharsToInsert,
          fractionalSuffixBegin,
          fractionalSuffixEnd - fractionalSuffixBegin);
      parsedDecimal.shiftFractionalSuffixPtrs(numCharsToInsert);
    }

    resultEnd += numCharsToInsert;
  }

  if (insertDecimalPoint) {
    *insertionPoint++ = '.';
  }

  while (numTrailingZerosToAdd) {
    *insertionPoint++ = '0';
    numTrailingZerosToAdd -= 1;
  }

  if (parsedDecimal.exponentSymbol) {
    // std::tochars outputs a lowercase e and it needs to be uppercase.
    *parsedDecimal.exponentSymbol = 'E';
  }

  size_t charsToRemove = 0;
  char* removalBegin = nullptr;
  if (!flagsSet.emitPositiveExponentSign() && parsedDecimal.exponentSign &&
      *parsedDecimal.exponentSign == '+') {
    // std::to_chars outputs a + sign, remove it if the flag wasn't set.
    // e.g., 1.23e+45 -> 1.23e45
    removalBegin = parsedDecimal.exponentSign;
    charsToRemove += 1;
  }

  if (char* p = parsedDecimal.exponentBegin; p && *p == '0') {
    // std::to_chars outputs a leading zero, remove it to match
    // double_conversion formating. e.g., 1.23e+04 -> 1.23e4
    if (!removalBegin) {
      removalBegin = p;
    }

    while (p != parsedDecimal.exponentEnd && *p == '0') {
      charsToRemove += 1;
      p += 1;
    }

    if (p == parsedDecimal.exponentEnd) {
      // they all were 0 digits. keep a single 0.
      charsToRemove -= 1;
      p -= 1;
      if (p == removalBegin) {
        // there was only one 0, keep it.
        removalBegin = nullptr;
      }
    }
  }

  if (charsToRemove && removalBegin) {
    size_t len = resultEnd - (removalBegin + charsToRemove);
    std::memmove(removalBegin, removalBegin + charsToRemove, len);
    resultEnd -= charsToRemove;
  }

  return std::pair{resultBegin, resultEnd};
}
#endif // FOLLY_CONV_AVALIABILITY_TO_CHARS_FLOATING_POINT
} // namespace detail

ConversionError makeConversionError(ConversionCode code, StringPiece input) {
  using namespace detail;
  static_assert(
      std::is_unsigned<std::underlying_type<ConversionCode>::type>::value,
      "ConversionCode should be unsigned");
  auto index = static_cast<std::size_t>(code);
  FOLLY_SAFE_CHECK(index < kErrorStrings.size(), "code=", uint64_t(index));
  const ErrorString& err = kErrorStrings[index];
  if (code == ConversionCode::EMPTY_INPUT_STRING && input.empty()) {
    return {err.string, code};
  }
  std::string tmp(err.string);
  tmp.append(": ");
  if (err.quote) {
    tmp.append(1, '"');
  }
  if (!input.empty()) {
    tmp.append(input.data(), input.size());
  }
  if (err.quote) {
    tmp.append(1, '"');
  }
  return {tmp, code};
}

} // namespace folly
