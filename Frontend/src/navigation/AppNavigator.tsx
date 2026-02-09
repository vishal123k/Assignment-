import {createNativeStackNavigator} from "@react-navigation/native-stack";

import AuthScreen from "../screens/AuthScreen";
import OtpScreen from "../screens/OtpScreen";
import ProfileSetup from "../screens/ProfileSetup";
import PetSetup from "../screens/PetSetup";
import MyProfile from "../screens/MyProfile";

const Stack = createNativeStackNavigator();

export default function AppNavigator(){
 return(
   <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Auth" component={AuthScreen}/>
      <Stack.Screen name="Otp" component={OtpScreen}/>
      <Stack.Screen name="ProfileSetup" component={ProfileSetup}/>
      <Stack.Screen name="PetSetup" component={PetSetup}/>
      <Stack.Screen name="MyProfile" component={MyProfile}/>
   </Stack.Navigator>
 )
}
