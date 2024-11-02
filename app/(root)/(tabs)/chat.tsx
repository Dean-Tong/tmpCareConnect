import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Chat = () => {
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My chats
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(root)/create-chat")}
          className="justify-center items-center w-10 h-10 rounded-full bg-white"
        >
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <Link href={`/(root)/heartrate`} style={{display:"flex", alignContent:"center", alignItems:"center"}}>
          <MaterialCommunityIcons name="heart" size={24} color="red" />
          <Text>Heart Rate</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
