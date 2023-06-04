import { View, Text,StyleSheet } from 'react-native'
import { colors } from '../styles/styles'
import React from 'react'

const OrderItemTextBox = ({orderItems,i}) => {
  return (
    
    
<View>
  {orderItems.map((item, index) => (
    
    <Text
      key={item._id}
      style={{
        marginVertical: 6,
        color: i % 2 === 0 ? colors.color3 : colors.color2,
        fontWeight: "400",
      }}
    >
       {item.name}    -   {item.quantity} adet  X  ₺{item.price}   
    </Text>
  ))}
</View>
      
    
  )
}

  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      elevation: 5,
    },
    text: {
      color: colors.color2,
      fontSize: 16,
      fontWeight: "900",
      marginHorizontal: -20,
      marginTop: -20,
      marginBottom: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
  });
  
  
  export default OrderItemTextBox