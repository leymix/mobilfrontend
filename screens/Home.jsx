import { View, Text, TouchableOpacity, ScrollView,StyleSheet,ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyle, colors } from "../styles/styles";
import Header from "../components/Header";
import { Avatar, Button } from "react-native-paper";
import SearchModal from "../components/SearchModal";
import ProductCard from "../components/ProductCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { useDispatch, useSelector } from "react-redux";
import { getAllNoFilterProducts, getAllProducts } from "../redux/actions/productAction";
import { useSetCategories } from "../utils/hooks";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import axios from "axios";
import { server } from "../redux/store";

const Home = () => {
  const [category, setCategory] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { products } = useSelector((state) => state.product);

  const [loading,setLoading]=useState(true);
  const [pageOn,setPageOn]=useState(false);

  const categoryButtonHandler = (id) => {
    
    // if (id === "") {
    //   setCategoryAllButton(true); 
    // } else {
    //   setCategoryAllButton(false); 
    // }
    // setCategory(id);


    if (id === "") {
      setCategory("");
      setCategoryAllButton(true);
      setPageOn(true); 
    } else {
      setCategory(id);
      setCategoryAllButton(false); 
      setPageOn(false);
    }

   
   
  };


  //new
  
  const [categoryAllButton,setCategoryAllButton]=useState(false)
  //new


  const addToCardHandler = (id, name, price, image, stock) => {
    if (stock === 0)
      return Toast.show({
        type: "error",
        text1: "Stokta Yok",
      });
    dispatch({
      type: "addToCart",
      payload: {
        product: id,
        name,
        price,
        image,
        stock,
        quantity: 1,
      },
    });
    Toast.show({
      type: "success",
      text1: "Sepete Eklendi",
    });
  };

  useSetCategories(setCategories, isFocused);


  

  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setLoading(true);
    const timeOutId = setTimeout(() => {
      if (categoryAllButton) {
        dispatch(getAllNoFilterProducts(quantity-1,searchQuery));
        setLoading(false);
        
      } else {
        dispatch(getAllProducts(searchQuery, category));
        setLoading(false);
      }
    }, 500);
  
    return () => {
      clearTimeout(timeOutId);
    };
  }, [dispatch, searchQuery, category, isFocused, categoryAllButton,quantity]);




 
  const incrementQty = () => {
    if(quantity>=pageLimit) return;
    
    setQuantity((prev) => prev + 1);
  };
  const decrementQty = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };
  const [pageLimit,setPageLimit]=useState(1);

  const pageLimitFunction = async () => {
    try {
      const response = await axios.get(`${server}/product/getallcount`);
      
      const totalCount=response.data.products;
   
      const pageLimit = Math.ceil(totalCount / 20); 
      setPageLimit(pageLimit);

     
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    pageLimitFunction();
  }, [categoryAllButton,pageOn]);

  useEffect(()=>{
    setCategoryAllButton(true);
    categoryButtonHandler("");
  },[])

  

  return (
    <>
      {activeSearch && (
        <SearchModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setActiveSearch={setActiveSearch}
          products={products}
        />
      )}
      <View style={defaultStyle}>
        <Header />

        {/* Heading Row */}
        <View
          style={{
            paddingTop: 70,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <Heading text1="Tarladan" text2="Ürünlerimiz" />

          {/* Search Bar */}

          <View>
            <TouchableOpacity onPress={() => setActiveSearch((prev) => !prev)}>
              <Avatar.Icon
                icon={"magnify"}
                size={50}
                color={"gray"}
                style={{ backgroundColor: colors.color2, elevation: 12 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}

        <View
          style={{
            flexDirection: "row",
            height: 80,
          }}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: "center",
            }}
            showsHorizontalScrollIndicator={false}
          >

            {/* new development All */}

                
                <Button
                
                style={{
                  backgroundColor:
                    categoryAllButton === true? colors.color1 : colors.color5,
                  borderRadius: 100,
                  margin: 5,
                }}
                
                onPress={() =>{
                  setCategoryAllButton(true)
                  categoryButtonHandler("")
                  

                
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: categoryAllButton === true ? colors.color2 : "gray",
                  }}
                >
                  Herşey
                </Text>
              </Button>



            {/* new development end */}



            {categories.map((item, index) => (
              <Button
                key={item._id}
                style={{
                  backgroundColor:
                    category === item._id ? colors.color1 : colors.color5,
                  borderRadius: 100,
                  margin: 5,
                }}
                onPress={() => {
                  categoryButtonHandler(item._id)
                
                }  }
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: category === item._id ? colors.color2 : "gray",
                  }}
                >
                  {item.category}
                </Text>
              </Button>
            ))}
          </ScrollView>
        </View>

        {/* Products */}

        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>



          {loading ? (
          <View style={style.container}>
          <ActivityIndicator size="large" color="#36E647" />
        </View>
          ) : (
          products.map((item, index) => (
          <ProductCard
           stock={item.stock}
            name={item.name}
            price={item.price}
           image={item.images[0]?.url}
            addToCardHandler={addToCardHandler}
            id={item._id}
            key={item._id}
            i={index}
            navigate={navigate}
          />
          ))
          )}
                  

           
          </ScrollView>
        </View>


                {pageOn?(
                   <View
                   style={{
                     width: 80,
                     flexDirection: "row",
                     justifyContent: "space-between",
                     alignItems: "center",
                   }}
                 >
       
       
                   
                   <TouchableOpacity onPress={decrementQty}>
                     <Avatar.Icon icon={"minus"} {...iconOptions} />
                   </TouchableOpacity>
       
                   <Text style={style.quantity}>{quantity}/{pageLimit}</Text>
       
                   <TouchableOpacity onPress={incrementQty}>
                     <Avatar.Icon icon={"plus"} {...iconOptions} />
                   </TouchableOpacity>
                 </View>

                ):("")}
       
      
              

      </View>
   

      <Footer activeRoute={"home"} />
    </>
  );
};

export default Home;


const style = StyleSheet.create({
  
  quantity: {
    backgroundColor: colors.color4,
    height: 25,
    width: 50,
    textAlignVertical: "center",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.color5,
    bottom:30,
  
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:300
    
  },
  


});

const iconOptions = {
  size: 25,
  style: {
    borderRadius: 5,
    backgroundColor: colors.color5,
    height: 25,
    width: 25,
    bottom:30,
  },
  
};

