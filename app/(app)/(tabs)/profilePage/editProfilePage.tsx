import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, TextInput, Dimensions, Image } from "react-native";
import { localData } from "@/app-data/appData";
import { useProps } from "../../../LoadingProp/propsProvider";
import { useRouter } from "expo-router";
import { color_pallete } from "@/constants/Colors";
import { SafeAreaView } from "react-native";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, fetchProfile } = localData();
  const { triggerLoadingScreen } = useProps();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [buttonColor, setButtonColor] = useState("#FBC19F");
  useEffect(()=>{
    triggerLoadingScreen({isLoading:!profile})
  },[profile])

  useEffect(() => {
    if (firstName !== "" || lastName !== "") {
      setButtonColor("#F98B4E");
    } else {
      setButtonColor("#FBC19F");
    }
  }, [firstName, lastName]);

  const handleSaveChanges = () => {
    if (firstName !== "" || lastName !== "") {
      console.log("Saving changes...", { firstName, lastName });
      fetchProfile();
      router.back();
    }
  };

  if(profile){
    return (
      <View style={[styles.container, { height: Dimensions.get("window").height - 90 }]}>
         {/* <SafeAreaView>
          <View style={[styles.header, {paddingBottom:5}]}>
            <Text style={styles.headerText}>Edit Profile</Text>
          </View>
         </SafeAreaView> */}
        <View style={styles.content}>
          <View style={styles.topSection}>
            {/* User Icon */}
             <Image
                source={{
                  uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LdlKUMY8VdtdQfwRogRVi4MU4LuzvX.png",
                  }}
                style={styles.userIcon}
               />
            {/* User Info */}
            <Text style={styles.userName}>{`${profile.first_name} ${profile.last_name}`}</Text>
            <View style={styles.emailWrapper}>
              <View style={styles.emailContainer}>
                <View style={styles.emailLine} />
                <Text style={styles.emailText}>{profile.username}</Text>
                <View style={styles.emailLine} />
              </View>
            </View>
  
            {/* Membership Info */}
            <View style={styles.membershipContainer}>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipText}>Valued MyRewards member since:</Text>
                <Text style={styles.membershipText}>XX.XX.XXXX</Text>
              </View>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipText}>Birthday:</Text>
                <Text style={styles.membershipText}>XX.XX.XXXX</Text>
              </View>
            </View>
          </View>
  
          {/* Editable Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Edit first name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.inputField}
              placeholder="Firstname"
            />
  
            <Text style={styles.inputLabel}>Edit last name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.inputField}
              placeholder="Lastname"
            />
          </View>
  
          {/* Reset Password Button */}
          <Pressable style={styles.resetPasswordButton}>
            <Text style={styles.resetPasswordText}>reset password</Text>
          </Pressable>
  
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <Pressable onPress={() => router.back()} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>cancel</Text>
            </Pressable>
            <Pressable style={[styles.saveChangesButton, { backgroundColor: buttonColor }]} onPress={handleSaveChanges}>
              <Text style={styles.saveChangesText}>save changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
  else{
    return null
  }
}

const styles = StyleSheet.create({
   header:{
      backgroundColor:color_pallete[10],
      elevation: 0,
      shadowOpacity: 0.1,
      borderBottomWidth:2,
      shadowColor:'black',
      shadowRadius:3,
      shadowOffset:{
        height:5,
        width:0
      },
      borderBottomColor:color_pallete[2],
    },
    headerText:{
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily:'Avenir Next',
      color:color_pallete[2],
      marginLeft:'5%'
    },
  container: {
    flex: 1,
    backgroundColor: "#fffbf7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  userIcon: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  userName: {
    fontFamily: "AvenirNext-Medium",
    fontSize: 28,
    color: "#F98B4E",
    fontWeight: "600",
    marginBottom: 8,
  },
  emailWrapper: {
    width: "100%",
    marginBottom: 8,
    marginTop: 20,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  emailLine: {
    height: 2.5,
    width: 77,
    backgroundColor: "#7F513A",
  },
  emailText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13,
    color: "#7F513A",
    textAlign: "center",
  },
  membershipContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 24,
  },
  membershipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  membershipText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13,
    color: "#407C9C",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center"
  },
  inputLabel: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    color: "#F98B4E",
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8B4513",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    color: "#8B4513",
  },
  resetPasswordButton: {
    backgroundColor: "#F98B4E",
    width: "100%",
    maxWidth: 320,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf:  "center"
  },
  resetPasswordText: {
    fontFamily: "AvenirNext-Bold",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: 20,
    maxWidth: 320,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "#F98B4E",
    borderWidth: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 12,
    alignItems: "center"
  },
  cancelButtonText: {
    fontFamily: "AvenirNext-Medium",
    color: "#F98B4E",
    fontSize: 16,
    textAlign: "center",
  },
  saveChangesButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 12,
    alignItems: "center"
  },
  saveChangesText: {
    fontFamily: "AvenirNext-Bold",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
