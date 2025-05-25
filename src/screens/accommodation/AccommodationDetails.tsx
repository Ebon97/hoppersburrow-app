import React, { useEffect, useState, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Share, Animated, Easing } from 'react-native';
import Swiper from 'react-native-swiper';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/color';
import NavigationBar from '../../components/NavigationBar';

const { width } = Dimensions.get('window');

const AccommodationDetails = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { id } = route.params;

  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  const [liked, setLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };

  const FEATURES = [
    { label: '1 Single Bed', icon: 'bed' },
    { label: 'Sharing Toilet and Bathroom', icon: 'users' },
    { label: '18m2', icon: 'maximize' },
    { label: 'Fully Refurnished', icon: 'home' },
  ];

  const AMENITIES = [
    { label: 'Free WiFi', icon: 'wifi' },
    { label: 'Parking Slot', icon: 'car' },
    { label: 'Sharing Bathroom', icon: 'users' },
    { label: 'Near University', icon: 'book' },
    { label: 'Free WiFi', icon: 'wifi' },
    { label: 'Parking Slot', icon: 'car' },
    { label: 'Sharing Bathroom', icon: 'users' },
    { label: 'Near University', icon: 'book' },
  ];

  const NEARBY = [
    '500 m from Shopping Mall',
    '800 m from Supermarket',
    '1km from Hospital',
    '1.2 km from University',
    '3.5 km from Airport',
  ];

  const LOCATION_COORDINATE = {
    latitude: 1.5533,
    longitude: 110.3592,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const HOUSE_RULES = [
    'Strictly no pets',
    'No parties and events',
    'No smoking',
  ];

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: 'Check out this accommodation!',
        message: `Room for RM 900/month at 111, Road Kuching, Sarawak.\n\nView more in our app.`,
        url: 'https://yourapp.com/accommodation/123', // optional
      });

      // Optionally handle the share result
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

 const handleToggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    animateLike();

    try {
      if (newLiked) {
        // await api.addFavorite(id);
        console.log('Liked');
      } else {
        // await api.removeFavorite(id);
        console.log('Unliked');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLiked(!newLiked); // revert on failure
    }
  };


  useEffect(() => {
    // const fetchImages = async () => {
    //   const response = await fetch(`https://your-api.com/accommodation/${id}`);
    //   const data = await response.json();
    //   // data.imageUrls = ['https://your-server.com/room/abc123.jpg', ...]
    //   setImages(data.imageUrls || []);
    // };

    // Simulated API response
    const mockApiImages: Record<number, string[]> = {
      1: [
        require('../../../assets/accommodation/room-1.jpg'),
        require('../../../assets/accommodation/room-2.jpg'),
        require('../../../assets/accommodation/room-3.jpg'),
      ],
      2: [
        require('../../../assets/accommodation/room-1.jpg'),
        require('../../../assets/accommodation/room-2.jpg'),
        require('../../../assets/accommodation/room-3.jpg'),
      ],
      3: [
        require('../../../assets/accommodation/room-1.jpg'),
        require('../../../assets/accommodation/room-2.jpg'),
        require('../../../assets/accommodation/room-3.jpg'),
      ],
    };

    const imageList = mockApiImages[id] || [];
    setImages(imageList);

    // fetchImages();
  }, [id]);


  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 300 }}>
        <Swiper
          autoplay={false}
          height={300}
          onIndexChanged={(index) => setActiveIndex(index)}
          loop={false}
          showsPagination={false} // ✅ hide the dots
        >
          {images.map((url, index) => (
            <Image key={index} source={url} style={styles.image} />
          ))}
        </Swiper>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>

        {/* Share & Heart Buttons */}
        <View style={styles.topRightButtons}>
         <TouchableOpacity style={styles.circleButton} onPress={handleShare}>
            <Icon name="share-2" size={18} color="#000" />
          </TouchableOpacity>
         <TouchableOpacity style={styles.circleButton} onPress={handleToggleLike}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? '#FF3B30' : '#000'}
            />
          </Animated.View>
        </TouchableOpacity>
        </View>

        {/* Image Counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.counterText}>{`${activeIndex + 1} / ${images.length}`}</Text>
        </View>
      </View>
      <ScrollView>
        {/* Room Info */}
        <View style={styles.container}>
          <Text style={styles.roomName}>Accommodation Name</Text>
          <Text style={styles.address}>111, Road Kuching, 93000, Kuching, Sarawak, Malaysia</Text>

          <View style={styles.sectionBlock}>
            <Text style={styles.price}>RM 900 <Text style={styles.perMonth}>/ per month</Text></Text>
            <Text style={styles.available}>Available after 1st Nov 2025</Text>
          </View>

          {/* Room Features */}
          <View style={styles.featuresRow}>
             {FEATURES.map((item, idx) => (
              <View key={idx} style={styles.featureCircleItem}>
                <View style={styles.iconCircle}>
                  <Icon name={item.icon} size={20} color="#555" />
                </View>
                <Text style={styles.featureLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>About Room & Property</Text>
            <Text style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s...
            </Text>
          </View>

          {/* Amenities */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenityGrid}>
              {AMENITIES.map((item, idx) => (
                <View key={idx} style={styles.amenityGridItem}>
                  <Icon name={item.icon} size={14} color="#999" style={{ marginRight: 12 }} />
                  <Text style={styles.amenityLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location */}
           <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Location</Text>
            {/* {mapReady && ( */}
              <MapView
                style={styles.map}
                initialRegion={LOCATION_COORDINATE}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                toolbarEnabled={false}
                liteMode={true}
              >
                <Marker
                  coordinate={LOCATION_COORDINATE}
                  title="Accommodation Name"
                  description="111, Road Kuching"
                >
                </Marker>
              </MapView>
            {/* )} */}
          </View>

          {/* Nearby */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>What’s Nearby</Text>
            <View style={styles.nearbyList}>
              {NEARBY.map((text, idx) => (
                <View key={idx} style={styles.nearbyItemRow}>
                  <Icon name="map-pin" size={14} color="#999" style={{ marginRight: 8 }} />
                  <Text style={styles.nearbyItemText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* House Rules */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>House Rules & Instructions</Text>
            <View style={styles.nearbyList}>
              {HOUSE_RULES.map((rule, idx) => (
                <Text key={idx} style={styles.nearbyItem}>{rule}</Text>
              ))}
            </View>
          </View>

          {/* Inquiry Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send Inquiry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Bottom Navigation */}
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperWrapper: {
    height: 250,
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    zIndex: 10,
  },
  topRightButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  circleButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  roomName: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Montserrat-Bold',
  },
  address: {
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.red,
    fontFamily: 'Montserrat-Regular',
  },
  perMonth: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  available: {
    color: '#999',
    marginTop: 4,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    gap: 20,
  },
  featureCircleItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  sectionBlock: {
    marginBottom: 20, // controls the gap between sections
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'Montserrat-SemiBold',
  },
  description: {
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
    fontSize: 13
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginTop: 8,
  },
  amenityGridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityLabel: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  nearbyList: {
    marginTop: 8,
  },
  nearbyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nearbyItemText: {
    color: '#555',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  nearbyItem: {
    marginBottom: 4,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default AccommodationDetails;
