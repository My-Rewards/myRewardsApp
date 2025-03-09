import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { useSession } from "../../../../auth/ctx";
import { localData } from "@/app-data/appData";
import { SvgXml } from "react-native-svg";
import { router } from "expo-router";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useRef, useState } from "react";
import BottomPopUp from "@/components/bottomPopUp";
const editProfileSvg = `
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8932 20.9996H3.00682C1.34877 20.9996 0 19.6508 0 17.9928V5.10643C0 3.44838 1.34877 2.09961 3.00682 2.09961H11.9994C12.474 2.09961 12.8584 2.48405 12.8584 2.9587C12.8584 3.43335 12.474 3.81779 11.9994 3.81779H3.00682C2.29646 3.81779 1.71818 4.39607 1.71818 5.10643V17.9928C1.71818 18.7032 2.29646 19.2814 3.00682 19.2814H15.8932C16.6035 19.2814 17.1818 18.7032 17.1818 17.9928V8.11325C17.1818 7.6386 17.5663 7.25416 18.0409 7.25416C18.5156 7.25416 18.9 7.6386 18.9 8.11325V17.9928C18.9 19.6508 17.5512 20.9996 15.8932 20.9996Z" fill="#F35E43"/>
    <path d="M20.7835 0.280002C20.4651 -0.0697529 19.9234 -0.0953448 19.5736 0.222954C19.564 0.232017 19.5544 0.240548 19.5454 0.250145L18.8858 0.906469C18.7194 1.07282 18.7194 1.34313 18.8858 1.50948L19.4905 2.11302C19.6568 2.2799 19.9266 2.28043 20.0935 2.11462C20.0935 2.11462 20.0946 2.11355 20.0951 2.11302L20.7381 1.47322C21.0634 1.14852 21.0938 0.619627 20.7835 0.280002ZM17.5523 2.23938L7.92695 11.847C7.86883 11.9051 7.82617 11.9771 7.80378 12.0565L7.35856 13.3825C7.32603 13.4928 7.38895 13.6091 7.49932 13.6416C7.53825 13.6528 7.5793 13.6528 7.61769 13.6416L8.94269 13.1964C9.02214 13.174 9.09412 13.1314 9.15224 13.0732L18.7605 3.44752C18.9455 3.26038 18.9455 2.95968 18.7605 2.77254L18.23 2.23938C18.0428 2.05277 17.7394 2.05277 17.5523 2.23938Z" fill="#F35E43"/>
  </svg>
`;

const signOutSvg = `
  <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.3913 3.34091L17.3913 5.72727C17.3913 6.25466 17.0022 6.68182 16.5217 6.68182C16.0413 6.68182 15.6522 6.25466 15.6522 5.72727L15.6522 3.34091C15.6522 2.55162 15.0668 1.90909 14.3478 1.90909L3.04348 1.90909C2.32446 1.90909 1.73913 2.55162 1.73913 3.34091L1.73913 17.6591C1.73913 18.4484 2.32446 19.0909 3.04348 19.0909L14.3478 19.0909C15.0668 19.0909 15.6522 18.4484 15.6522 17.6591L15.6522 15.2727C15.6522 14.7453 16.0413 14.3182 16.5217 14.3182C17.0022 14.3182 17.3913 14.7453 17.3913 15.2727L17.3913 17.6591C17.3913 19.5014 16.0261 21 14.3478 21L3.04348 21C1.36522 21 -6.10318e-08 19.5014 -1.36058e-07 17.6591L-7.19165e-07 3.34091C-7.94191e-07 1.49864 1.36522 2.93576e-07 3.04348 2.14837e-07L14.3478 -3.15528e-07C16.0261 -3.94266e-07 17.3913 1.49864 17.3913 3.34091Z" fill="#F35E43"/>
    <path d="M25 10.4994C25 11.0365 24.6062 11.4716 24.1201 11.4716L9.52599 11.4716L12.4237 14.6731C12.7674 15.0529 12.7674 15.6684 12.4237 16.0482C12.08 16.4279 11.5229 16.4279 11.1791 16.0482L6.77953 11.1872C6.43581 10.8074 6.43581 10.1919 6.77953 9.81215L11.1791 4.95117C11.5229 4.5714 12.08 4.5714 12.4237 4.95117C12.7674 5.33093 12.7674 5.94645 12.4237 6.32622L9.52599 9.52778L24.1201 9.52778C24.6062 9.52778 25 9.96284 25 10.5L25 10.4994Z" fill="#F35E43"/>
  </svg>
`;

const trashSvg = `
  <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.2083 5H0.791667C0.354271 5 0 4.5525 0 4C0 3.4475 0.354271 3 0.791667 3H18.2083C18.6457 3 19 3.4475 19 4C19 4.5525 18.6457 5 18.2083 5Z" fill="#F35E43"/>
    <path d="M13.812 22H5.18707C3.97115 22 3.00506 20.9986 2.9385 19.6701L2.00148 3.84125C1.9757 3.40486 2.28976 3.02883 2.70319 3.00162C3.11709 2.97391 3.47287 3.3059 3.49865 3.74229L4.43614 19.5751C4.43614 19.5781 4.43614 19.581 4.43661 19.584C4.46099 20.0818 4.76286 20.4162 5.18754 20.4162H13.8125C14.2329 20.4162 14.5348 20.0788 14.5639 19.5761L15.5013 3.74229C15.5271 3.3059 15.8848 2.97391 16.2968 3.00162C16.7102 3.02883 17.0243 3.40486 16.9985 3.84125L16.061 19.6741C15.9832 21.0213 15.0373 21.9995 13.8125 21.9995L13.812 22Z" fill="#F35E43"/>
    <path d="M12.7732 18.9995C12.7635 18.9995 12.7533 18.9995 12.7436 18.9995C12.292 18.9837 11.9392 18.617 11.9551 18.1802L12.3642 7.09711C12.3805 6.66022 12.7584 6.31882 13.211 6.33416C13.6625 6.34999 14.0153 6.71662 13.9995 7.15351L13.5904 18.2366C13.5745 18.664 13.2115 19 12.7732 19V18.9995ZM6.22679 18.9995C5.78855 18.9995 5.42549 18.6635 5.40964 18.2361L5.00055 7.15302C4.98418 6.71613 5.33753 6.349 5.78907 6.33366C6.24162 6.31931 6.62003 6.65972 6.63588 7.09661L7.04497 18.1797C7.06133 18.6165 6.70798 18.9837 6.25645 18.999C6.24673 18.999 6.23651 18.999 6.22679 18.999V18.9995ZM9.50002 18.9995C9.04797 18.9995 8.68184 18.6452 8.68184 18.2079V7.12481C8.68184 6.68743 9.04797 6.33317 9.50002 6.33317C9.95206 6.33317 10.3182 6.68743 10.3182 7.12481V18.2079C10.3182 18.6452 9.95206 18.9995 9.50002 18.9995ZM12.7727 4.74988C12.3207 4.74988 11.9546 4.39561 11.9546 3.95823V1.97219C11.954 1.75844 11.772 1.58329 11.549 1.58329H7.44741C7.22599 1.58379 7.04497 1.76042 7.04548 1.97664V3.95823C7.04548 4.39561 6.67935 4.74988 6.2273 4.74988C5.77526 4.74988 5.40912 4.39561 5.40912 3.95823V1.97912C5.40606 0.892086 6.31935 0.00296867 7.44485 0H11.5516C12.6725 0 13.5878 0.88219 13.5909 1.96971V3.95823C13.5909 4.39561 13.2248 4.74988 12.7727 4.74988Z" fill="#F35E43"/>
  </svg>
`;

const legalSvg = `
  <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_249_441)">
    <path d="M16.4091 17H2.59091C1.16591 17 0 15.8525 0 14.45V5.95C0 4.5475 1.16591 3.4 2.59091 3.4H5.18182V1.36C5.18182 0.612 5.80364 0 6.56364 0H12.4364C13.1964 0 13.8182 0.612 13.8182 1.36V3.4H16.4091C17.8341 3.4 19 4.5475 19 5.95V14.45C19 15.8525 17.8341 17 16.4091 17ZM2.59091 5.1C2.11591 5.1 1.72727 5.4825 1.72727 5.95V14.45C1.72727 14.9175 2.11591 15.3 2.59091 15.3H16.4091C16.8841 15.3 17.2727 14.9175 17.2727 14.45V5.95C17.2727 5.4825 16.8841 5.1 16.4091 5.1H12.9545H2.59091ZM6.90909 3.4H12.0909V1.7H6.90909V3.4Z" fill="#F35E43"/>
    </g>
    <defs>
    <clipPath id="clip0_249_441">
    <rect width="19" height="17" fill="white"/>
    </clipPath>
    </defs>
  </svg>
`;

const privacySvg = `
  <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.781319 18.2308C0.354198 18.2308 0 17.8766 0 17.4495V2.86484C0 1.28136 1.28136 0 2.86484 0H16.8244C17.5953 0 18.2308 0.635473 18.2308 1.40637V15.0638C18.2308 15.4909 17.8766 15.8451 17.4495 15.8451C17.0223 15.8451 16.6681 15.4909 16.6681 15.0638V1.56264H2.86484C2.14602 1.56264 1.56264 2.14602 1.56264 2.86484V17.4495C1.56264 17.8766 1.20844 18.2308 0.781319 18.2308Z" fill="#F35E43"/>
    <path d="M11.6156 13.0217H6.61517C5.84427 13.0217 5.2088 12.3862 5.2088 11.6153V8.69841C5.2088 8.05252 5.64634 7.50039 6.25056 7.34412V5.98984C6.25056 4.83348 7.01104 3.125 9.11539 3.125C11.2197 3.125 11.9802 4.83348 11.9802 5.98984V7.34412C12.5844 7.50039 13.022 8.05252 13.022 8.69841V11.6153C13.022 12.3862 12.3865 13.0217 11.6156 13.0217ZM6.77144 11.4591H11.4593V8.85467H6.77144V11.4591ZM7.81319 7.29203H10.4176V5.98984C10.4176 5.85441 10.3759 4.68764 9.11539 4.68764C7.85486 4.68764 7.81319 5.85441 7.81319 5.98984V7.29203Z" fill="#F35E43"/>
    <path d="M17.4495 16.1476H2.86483C2.43771 16.1476 2.08352 15.7934 2.08352 15.3663C2.08352 14.9392 2.43771 14.585 2.86483 14.585H17.4495C17.8766 14.585 18.2308 14.9392 18.2308 15.3663C18.2308 15.7934 17.8766 16.1476 17.4495 16.1476Z" fill="#F35E43"/>
    <path d="M17.4495 20.3146H2.86483C2.43771 20.3146 2.08352 19.9604 2.08352 19.5333C2.08352 19.1062 2.43771 18.752 2.86483 18.752H17.4495C17.8766 18.752 18.2308 19.1062 18.2308 19.5333C18.2308 19.9604 17.8766 20.3146 17.4495 20.3146Z" fill="#F35E43"/>
    <path d="M2.86484 20.3146C1.28136 20.3146 0 19.0333 0 17.4498C0 15.8663 1.28136 14.585 2.86484 14.585C3.29196 14.585 3.64615 14.9392 3.64615 15.3663C3.64615 15.7934 3.29196 16.1476 2.86484 16.1476C2.14602 16.1476 1.56264 16.731 1.56264 17.4498C1.56264 18.1686 2.14602 18.752 2.86484 18.752C3.29196 18.752 3.64615 19.1062 3.64615 19.5333C3.64615 19.9604 3.29196 20.3146 2.86484 20.3146Z" fill="#F35E43"/>
  </svg>
`;

export default function ProfilePage() {
  const bottomSheetRef = useRef(null);
  const { signOut, userSub } = useSession();
  const [showBottomPopUp, setShowBottomPopUp] = useState(false);
  const toggleBottomPopUp = () => {
    setShowBottomPopUp(!showBottomPopUp);
  };
  const handleSignOut = () => {
    signOut();
    toggleBottomPopUp();
  };
  const { profile } = localData();
  const windowHeight = Dimensions.get("window").height;
  const config = useAppConfig();
  console.log(userSub);
  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }


  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

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
          >{`${profile.first_name} ${profile.last_name}`}</Text>
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
              <Text style={styles.membershipText}>
                Valued MyRewards member since:
              </Text>
              <Text style={styles.membershipText}>
                {formatDate(profile.dob)}
              </Text>
            </View>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipText}>Birthday:</Text>
              <Text style={styles.membershipText}>
                {formatDate(profile.dob)}
              </Text>
            </View>
            <View style={styles.membershipRow}>
              {config ? (
                <Text style={styles.membershipText}>
                  {"Config Received: " + config.isBeta}
                </Text>
              ) : (
                <Text style={styles.membershipText}>Loading config...</Text>
              )}
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

            <Pressable style={styles.menuItem} onPress={signOut}>
              <Text style={styles.menuText}>Sign out</Text>
              <SvgXml
                xml={signOutSvg}
                style={styles.menuIcon}
                height={18} // Adjust size as needed
                width={20} // Adjust size as needed
              />
            </Pressable>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem}>
              <Text style={styles.deleteText}>Delete account</Text>
              <SvgXml
                xml={trashSvg}
                height={18} // Adjust size as needed
                width={18} // Adjust size as needed
              />
            </Pressable>
            {/* <BottomPopUp visible={showBottomPopUp} onClose={toggleBottomPopUp}>
              <Pressable onPress={handleSignOut}>
                <SvgXml xml={signOutSvg} width={25} height={25} />
                <Text>Sign Out</Text>
              </Pressable>
            </BottomPopUp> */}
            
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
