import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useSession } from "@/auth/ctx";
import { SvgXml } from "react-native-svg";
import { router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import BottomPopUp from "@/components/bottomPopUp";
import BottomSheet from "@gorhom/bottom-sheet";
import formatDate from "@/services/formatDate";
import deleteUser from "@/APIs/deleteUser";
import { localData } from "@/app-data/appData";
import {
  editProfileSvg,
  signOutSvg,
  trashSvg,
  legalSvg,
  privacySvg,
} from "@/constants/profileSvgs";

export default function ProfilePage() {
  const bottomSheetSignOutRef = useRef<BottomSheet>(null);
  const bottomSheetDeleteRef = useRef<BottomSheet>(null);
  const [isSignOutOpen, setSignOutOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { profile } = localData();

  const toggleSignOutSheet = () => {
    setSignOutOpen(!isSignOutOpen);
    bottomSheetSignOutRef.current?.expand();
  };
  const toggleDeleteSheet = () => {
    setDeleteOpen(!isDeleteOpen);
    bottomSheetDeleteRef.current?.expand();
  };

  const { signOut } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  const handleDelete = async () => {
    Alert.alert("Delete Account?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => await deleteUser() },
    ]);
    signOut();
  };

  const windowHeight = Dimensions.get("window").height;

  return (
    <View style={[styles.container, { height: windowHeight - 90 }]}>
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
          <Text
            style={styles.userName}
          >{`${profile?.fullname?.firstName} ${profile?.fullname?.lastName}`}</Text>
          <View style={styles.emailWrapper}>
            <View style={styles.emailContainer}>
              <View style={styles.emailLine} />
              <Text style={styles.emailText}>
                {profile?.email || "email@email.com"}
              </Text>
              <View style={styles.emailLine} />
            </View>
          </View>

          {/* Membership Info */}
          <View style={styles.membershipContainer}>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipText}>
                Valued MyRewards member since:
              </Text>
              <Text style={styles.membershipText}>
                {formatDate(
                  profile?.date_created
                    ? new Date(profile.date_created)
                    : new Date()
                )}
              </Text>
            </View>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipText}>Birthday:</Text>
              <Text style={styles.membershipText}>
                {formatDate(
                  profile?.birthdate ? new Date(profile.birthdate) : new Date()
                )}
              </Text>
            </View>
          </View>

          {/* View Plans Button */}
          <Pressable
            style={styles.viewPlansButton}
            onPress={() => router.navigate("../../(tabs)/plansPage")}
          >
            <Text style={styles.viewPlansText}>view your plans</Text>
          </Pressable>
        </View>

        <View style={styles.actionButtonContainer}>
          {/* First Card Group */}
          <View style={styles.card}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.navigate("profilePage/editProfilePage")}
            >
              <Text style={styles.menuText}>Edit profile</Text>
              <SvgXml xml={editProfileSvg} height={18} width={18} />
            </Pressable>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={toggleSignOutSheet}>
              <Text style={styles.menuText}>Sign out</Text>
              <SvgXml
                xml={signOutSvg}
                style={styles.menuIcon}
                height={18} // Adjust size as needed
                width={20} // Adjust size as needed
              />
            </Pressable>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={toggleDeleteSheet}>
              <Text style={styles.deleteText}>Delete account</Text>
              <SvgXml
                xml={trashSvg}
                height={18} // Adjust size as needed
                width={18} // Adjust size as needed
              />
            </Pressable>
          </View>

          {/* Second Card Group */}
          <View style={styles.card}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.navigate("profilePage/privacy-policy")}
            >
              <Text style={styles.menuText}>Privacy</Text>
              <SvgXml
                xml={privacySvg}
                height={18} // Adjust size as needed
                width={18} // Adjust size as needed
              />
            </Pressable>
            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("profilePage/legal")}
            >
              <Text style={styles.menuText}>Legal</Text>
              <SvgXml
                xml={legalSvg}
                height={18} // Adjust size as needed
                width={18} // Adjust size as needed
              />
            </Pressable>
          </View>
        </View>
      </View>
      {isSignOutOpen && (
        <BottomPopUp
          ref={bottomSheetSignOutRef}
          buttonTitle="sign out"
          description="Stay signed in to log your next visit faster"
          backgroundColor="#F98B4E"
          onClose={toggleSignOutSheet}
          onSubmit={handleSignOut}
        />
      )}
      {isDeleteOpen && (
        <BottomPopUp
          ref={bottomSheetDeleteRef}
          buttonTitle="delete"
          description="Delete account? This action cannot be undone."
          backgroundColor="#F35E43"
          onClose={toggleDeleteSheet}
          onSubmit={handleDelete}
        />
      )}
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
    marginTop: 20,
    marginBottom: 8,
  },
  userIcon: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  userName: {
    fontFamily: "AvenirNext-Medium",
    fontSize: 32,
    color: "#F98B4E",
    fontWeight: "600",
    marginBottom: 8,
  },
  emailWrapper: {
    width: "100%",
    marginBottom: 8, // Increase space below the email section
    marginTop: 20, // Add some top spacing to push it down
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
    marginBottom: 20, // Push the membership lines further down
    marginTop: 5, // Adjust the top margin if needed
  },
  membershipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  membershipText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13,
    color: "#2A5D79",
  },
  viewPlansButton: {
    backgroundColor: "#F98B4E",
    width: "100%",
    maxWidth: 320,
    padding: 12,
    borderRadius: 12,
    marginBottom: 26, // Keep the "View Your Plans" button in its current place
    marginTop: 2,
  },
  viewPlansText: {
    fontFamily: "AvenirNext-Bold",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  actionButtonContainer: {
    width: "100%",
    maxWidth: 320, // Adjusted width
    gap: 24, // Spacing between cards
    alignSelf: "center",
    marginTop: -10, // Reduced spacing above
    marginBottom: 20, // Adjusted spacing below
  },
  card: {
    borderWidth: 1,
    borderColor: "#7F513A",
    borderRadius: 10, // Slightly more rounded corners
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuText: {
    fontFamily: "AvenirNext-Medium",
    fontSize: 14,
    color: "#8B4513",
  },
  menuIcon: {
    position: "absolute",
    right: 16,
  },
  deleteText: {
    fontFamily: "AvenirNext-Medium",
    fontSize: 14,
    color: "#F35E43",
  },
  flipHorizontal: {
    transform: [{ scaleX: -1 }],
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#8B4513",
    width: "92%", // Adjusted to align with new card size
    alignSelf: "center",
  },
  modalContent: {
    height: 1 / 2,
  },
  modalTitle: {},
  modalButtonText: {},
  modalMessage: {},
  modalButton: {},
  modalButtons: {},
});
