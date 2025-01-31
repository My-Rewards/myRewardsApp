import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, TextInput, Dimensions, Image } from "react-native";
import { getMockUserProfile, UserProfile } from "@/api/mockApi";

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    getMockUserProfile().then((data) => {
      setProfile(data);
      setFirstName(data.first_name);
      setLastName(data.last_name);
    });
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSaveChanges = () => {
    // Mock saving logic
    console.log("Saving changes...", { firstName, lastName });
  };

  return (
    <View style={[styles.container, { height: Dimensions.get("window").height - 90 }]}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          {/* User Icon */}
          <Image
            source={{ uri: "https://via.placeholder.com/70" }}
            style={styles.userIcon}
          />

          {/* User Info */}
          <Text style={styles.userName}>{`${profile.first_name} ${profile.last_name}`}</Text>
          <View style={styles.emailWrapper}>
            <View style={styles.emailContainer}>
              <View style={styles.emailLine} />
              <Text style={styles.emailText}>{profile.email}</Text>
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
          <Pressable style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>cancel</Text>
          </Pressable>
          <Pressable style={styles.saveChangesButton} onPress={handleSaveChanges}>
            <Text style={styles.saveChangesText}>save changes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "#8B4513",
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
  },
  inputLabel: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    color: "#8B4513",
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
    maxWidth: 320,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderColor: "#F98B4E",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontFamily: "AvenirNext-Medium",
    color: "#F98B4E",
    fontSize: 16,
    textAlign: "center",
  },
  saveChangesButton: {
    backgroundColor: "#F98B4E",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  saveChangesText: {
    fontFamily: "AvenirNext-Bold",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
