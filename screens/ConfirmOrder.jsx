import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors, defaultStyle } from "../styles/styles";
import Header from "../components/Header";
import Heading from "../components/Heading";
import ConfirmOrderItem from "../components/ConfirmOrderItem";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";

const ConfirmOrder = () => {
  const navigate = useNavigation();

  const { cartItems } = useSelector((state) => state.cart);

  const [itemsPrice] = useState(
    cartItems.reduce((prev, curr) => prev + curr.quantity * curr.price, 0)
  );
  const [shippingCharges] = useState(itemsPrice > 500 ? 0 : 200);
  const [totalAmount] = useState(itemsPrice + shippingCharges);
  return (
    <View style={defaultStyle}>
      <Header back={true} />
      {/* Heading */}
      <Heading
        containerStyle={{
          paddingTop: 70,
        }}
        text1="Sipariş"
        text2="Onaylama"
      />

      <View
        style={{
          paddingVertical: 20,
          flex: 1,
        }}
      >
        <ScrollView>
          {cartItems.map((i) => (
            <ConfirmOrderItem
              key={i.product}
              price={i.price}
              image={i.image}
              name={i.name}
              quantity={i.quantity}
            />
          ))}
        </ScrollView>
      </View>

      <PriceTag heading={"Sepet Fiyatı"} value={itemsPrice} />
      <PriceTag heading={"Kargo"} value={shippingCharges} />
      
      <PriceTag heading={"Toplam"} value={totalAmount} />

      <TouchableOpacity
        onPress={() =>
          navigate.navigate("payment", {
            itemsPrice,
            shippingCharges,
            totalAmount,
          })
        }
      >
        <Button
          style={{
            backgroundColor: colors.color3,
            borderRadius: 100,
            padding: 5,
            margin: 10,
          }}
          textColor={colors.color2}
          icon={"chevron-right"}
        >
          Ödeme Yap
        </Button>
      </TouchableOpacity>
    </View>
  );
};
const PriceTag = ({ heading, value }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 5,
    }}
  >
    <Text style={{ fontWeight: "800" }}>{heading}</Text>
    <Text>₺{value}</Text>
  </View>
);

export default ConfirmOrder;
