// screens/TopUpPayment.tsx
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import BackHeader from '../../components/BackHeader';

const TopUpPayment = ({ route }) => {
    const navigation = useNavigation();
    const { amount, kwh, roomName, address } = route.params;

    const [name, setName] = useState('John Doe');
    const [phone, setPhone] = useState('+6012 345 6789');
    const [email, setEmail] = useState('johndoe@gmail.com');
    const [selectedMethod, setSelectedMethod] = useState('');

    const handlePay = () => {
        if (!name.trim() || !phone.trim() || !email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Info',
                text2: 'Please fill in all fields.',
            });
            return;
        }

        if (!selectedMethod) {
            Toast.show({
                type: 'error',
                text1: 'Payment Method Required',
                text2: 'Please choose at least one payment method.',
            });
            return;
        }

        // ✅ Navigate to confirmation screen
        navigation.navigate('PaymentConfirmation', {
            amount,
            kwh,
            roomName,
            address,
            name,
            phone,
            email,
            paymentMethod: selectedMethod,
        });
    };

    const PAYMENT_METHODS = [
        'Credit Card / Debit Card',
        'Online Banking',
        'Touch N Go',
        'SPAY',
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <BackHeader title="Top Up Payment" />
                <View style={styles.sectionBlock}>
                    <View style={styles.amountCard}>
                        <View style={styles.amountHeader}>
                            <View>
                                <Text style={styles.amountLabel}>Amount</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.amountValue}>RM {parseFloat(amount).toFixed(2)}</Text>
                                <Text style={styles.kwh}>+{kwh} kWh</Text>
                            </View>
                        </View>
                        <View style={styles.roomRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.roomInfo}>{roomName}</Text>
                                <Text style={styles.address} numberOfLines={2}>{address}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.inputGroup}>
                        <Icon name="user" size={18} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Icon name="phone" size={18} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Icon name="mail" size={18} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <Text style={styles.sectionSubtitle}>Please choose at least one method</Text>

                    {PAYMENT_METHODS.map((method, idx) => {
                        const isSelected = selectedMethod === method;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                                onPress={() => setSelectedMethod(method)}
                            >
                                <Text style={[styles.paymentText, isSelected && styles.paymentTextSelected]}>
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                    <Text style={styles.payButtonText}>Pay</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TopUpPayment;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    amountCard: {
        backgroundColor: '#2C3E50',
        borderRadius: 12,
        padding: 16,
        position: 'relative',
    },
    amountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    amountLabel: {
        marginTop: 12,
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
    },
    amountValue: {
        color: '#fff',
        fontSize: 34,
        fontFamily: 'Montserrat-Bold',
    },
    roomInfo: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        marginTop: 6,
    },
    address: {
        color: '#bbb',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        marginBottom: 10,
    },
    kwh: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    },
    roomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    statusBadge: {
        marginTop: 8,
        backgroundColor: '#f1c40f',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-end',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Montserrat-Bold',
        color: '#fff',
    },
    sectionBlock: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: '#777',
        marginBottom: 16,
        marginTop: -8
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        paddingVertical: 10,
        color: '#000',
    },
    paymentOption: {
        backgroundColor: '#f3f3f3',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    paymentText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#333',
    },
    payButton: {
        marginTop: 20,
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
    },
    paymentOptionSelected: {
        backgroundColor: '#333',
    },
    paymentTextSelected: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#fff',
    },
});
