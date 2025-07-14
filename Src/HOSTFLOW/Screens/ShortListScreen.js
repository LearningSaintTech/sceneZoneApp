// import React, { useState, useEffect } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   Platform,
//   Modal,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import Feather from "react-native-vector-icons/Feather";
// import LinearGradient from "react-native-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useSelector } from "react-redux";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import { API_BASE_URL } from "../Config/env";
// import api from "../Config/api";

// const { width, height } = Dimensions.get("window");

// const isTablet = width >= 768;
// const isSmallPhone = width < 350;

// const dimensions = {
//   spacing: {
//     xs: Math.max(width * 0.01, 4),
//     sm: Math.max(width * 0.02, 8),
//     md: Math.max(width * 0.03, 12),
//     lg: Math.max(width * 0.04, 16),
//     xl: Math.max(width * 0.05, 20),
//     xxl: Math.max(width * 0.06, 24),
//   },
//   fontSize: {
//     small: Math.max(width * 0.03, 12),
//     body: Math.max(width * 0.035, 14),
//     title: Math.max(width * 0.04, 16),
//     header: Math.max(width * 0.045, 18),
//     large: Math.max(width * 0.05, 20),
//     xlarge: Math.max(width * 0.055, 22),
//   },
//   borderRadius: {
//     sm: Math.max(width * 0.015, 5),
//     md: Math.max(width * 0.025, 10),
//     lg: Math.max(width * 0.03, 12),
//     xl: Math.max(width * 0.06, 20),
//     xxl: Math.max(width * 0.08, 30),
//   },
//   buttonHeight: Math.max(height * 0.06, 44),
//   iconSize: Math.max(width * 0.06, 20),
//   imageHeight: Math.min(width * 0.55, height * 0.3),
//   cardPadding: Math.max(width * 0.03, 12),
// };

// const ShortlistScreen = ({ navigation }) => {
//   const [theme, setTheme] = useState("dark");
//   const [shortlistedItems, setShortlistedItems] = useState({});
//   const [apiData, setApiData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("Shortlist");
//   const [isAddOptionsModalVisible, setAddOptionsModalVisible] = useState(false);
//   const [isContractDetailsModalVisible, setContractDetailsModalVisible] =
//     useState(false);
//   const [
//     isAddToExistingEventsModalVisible,
//     setAddToExistingEventsModalVisible,
//   ] = useState(false);
//   const [manageEvents, setManageEvents] = useState([]);
//   const [manageEventsLoading, setManageEventsLoading] = useState(false);
//   const [existingEvents, setExistingEvents] = useState([]);
//   const [existingEventsLoading, setExistingEventsLoading] = useState(false);
//   const [selectedArtist, setSelectedArtist] = useState(null);

//   const token = useSelector((state) => state.auth.token);
//   const insets = useSafeAreaInsets();

//   console.log("ShortlistScreen initialized", {
//     theme,
//     token,
//     activeTab,
//     insets,
//   });

//   useFocusEffect(
//     React.useCallback(() => {
//       const fetchShortlistedArtists = async () => {
//         // console.log("fetchShortlistedArtists called", { token, activeTab });
//         if (!token) {
//           console.log("No token available, skipping API call");
//           setLoading(false);
//           return;
//         }
//         setLoading(true);
//         try {
//           const response = await axios.get(
//             `${API_BASE_URL}/host/getShortlistedArtists`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           console.log("Shortlisted artists API response", response?.data);
//           if (response?.data?.success && Array?.isArray(response?.data?.data)) {
//             console.log("Setting apiData", response?.data?.data);
//             setApiData(response?.data?.data);
//             const initialStatus = {};
//             response?.data?.data.forEach((item) => {
//               console.log("no image item",item)
//               initialStatus[item?.artistProfile?._id] = true;
//             });
//             console.log("Setting shortlistedItems", initialStatus);
//             setShortlistedItems(initialStatus);
//           } else {
//             console.error(
//               "Failed to fetch shortlisted artists:",
//               response.data.message
//             );
//             setApiData([]);
//           }
//         } catch (error) {
//           console.error(
//             "API error fetching shortlisted artists:",
//             error.response?.data || error.message
//           );
//           setApiData([]);
//         } finally {
//           console.log("fetchShortlistedArtists completed, loading:", false);
//           setLoading(false);
//         }
//       };
//       if (activeTab === "Shortlist") {
//         console.log("Active tab is Shortlist, calling fetchShortlistedArtists");
//         fetchShortlistedArtists();
//       }
//     }, [token, activeTab])
//   );

//   const formatEventDate = (dateArr) => {
//   console.log("formatEventDate called", { dateArr });
//   if (!Array.isArray(dateArr) || !dateArr[0]) {
//     console.log("Invalid date array, returning empty string");
//     return "";
//   }
//   const date = new Date(dateArr[0]);
//   if (isNaN(date)) {
//     console.log("Invalid date, returning empty string");
//     return "";
//   }
//   const formatted = `${date.toLocaleString("en-US", {
//     month: "short",
//   })} ${date.getDate()}`;
//   console.log("Formatted date", formatted);
//   return formatted;
// };



//   const formatEventTime = (eventTime) => {
//     console.log("formatEventTime called", { eventTime });
//     if (!eventTime) {
//       console.log("No event time, returning empty string");
//       return "";
//     }
//     console.log("Formatted time", eventTime);
//     return eventTime;
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       // const fetchManageEvents = async () => {
//       //   console.log("fetchManageEvents called", { token, activeTab });
//       //   if (!token) {
//       //     console.log("No token available, setting empty manageEvents");
//       //     setManageEvents([]);
//       //     setManageEventsLoading(false);
//       //     return;
//       //   }
//       //   if (activeTab !== "Manage Event") {
//       //     console.log("Active tab is not Manage Event, skipping fetch");
//       //     return;
//       //   }
//       //   setManageEventsLoading(true);
//       //   try {
//       //     const response = await axios.get(
//       //       `${API_BASE_URL}/host/events/get-all-events`,
//       //       {
//       //         headers: {
//       //           Authorization: `Bearer ${token}`,
//       //           "Content-Type": "application/json",
//       //         },
//       //       }
//       //     );
//       //     console.log("Manage events API response", response.data);
//       //     if (response.data.success && Array.isArray(response.data.data)) {
//       //       const mappedEvents = response.data.data.map((event) => ({
//       //         ...event,
//       //         formattedDate: formatEventDate(event.eventDate),
//       //         formattedTime: formatEventTime(event.eventTime),
//       //       }));
//       //       console.log("Mapped events", mappedEvents);
//       //       setManageEvents(mappedEvents);
//       //     } else {
//       //       console.log("No valid events data, setting empty manageEvents");
//       //       setManageEvents([]);
//       //     }
//       //   } catch (error) {
//       //     console.error("Fetch error:", error);
//       //     setManageEvents([]);
//       //   } finally {
//       //     console.log(
//       //       "fetchManageEvents completed, manageEventsLoading:",
//       //       false
//       //     );
//       //     setManageEventsLoading(false);
//       //   }
//       // };
      
//       const fetchManageEvents = async () => {
//   console.log("fetchManageEvents called", { token, activeTab });
//   if (!token) {
//     console.log("No token available, setting empty manageEvents");
//     setManageEvents([]);
//     setManageEventsLoading(false);
//     return;
//   }
//   if (activeTab !== "Manage Event") {
//     console.log("Active tab is not Manage Event, skipping fetch");
//     return;
//   }
//   setManageEventsLoading(true);
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/host/events/get-all-events`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Manage events API response", response.data);
//     if (response.data.success && Array.isArray(response.data.data)) {
//       const mappedEvents = response.data.data.map((event) => ({
//         ...event,
//         formattedDate: formatEventDate(event.eventDateTime),
//         formattedTime: formatEventTime(event.eventTime),
//       }));
//       console.log("Mapped events", mappedEvents);
//       setManageEvents(mappedEvents);
//     } else {
//       console.log("No valid events data, setting empty manageEvents");
//       setManageEvents([]);
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//     setManageEvents([]);
//   } finally {
//     console.log("fetchManageEvents completed, manageEventsLoading:", false);
//     setManageEventsLoading(false);
//   }
// };
//       fetchManageEvents();
//     }, [token, activeTab])
//   );

//   const responsiveDimensions = {
//     ...dimensions,
//     safeAreaTop: Math.max(insets.top, 0),
//     safeAreaBottom: Math.max(insets.bottom, 0),
//     safeAreaLeft: Math.max(insets.left, 0),
//     safeAreaRight: Math.max(insets.right, 0),
//     containerPadding: {
//       horizontal: Math.max(
//         insets.left + dimensions.spacing.md,
//         dimensions.spacing.md
//       ),
//       vertical: Math.max(
//         insets.top + dimensions.spacing.sm,
//         dimensions.spacing.sm
//       ),
//     },
//   };

//   console.log("Responsive dimensions calculated", responsiveDimensions);

//   const themes = {
//     dark: {
//       backgroundColor: "#000",
//       textColor: "#fff",
//       subColor: "#ccc",
//       cardBackground: "#1a1a1a",
//       activeTabBackground: "#a95eff",
//       navBackground: "#1a1a1a",
//     },
//     light: {
//       backgroundColor: "#fff",
//       textColor: "#000",
//       subColor: "#666",
//       cardBackground: "#f0f0f0",
//       activeTabBackground: "#a95eff",
//       navBackground: "#e0e0e0",
//     },
//   };

//   const currentTheme = themes[theme];
//   console.log("Current theme", currentTheme);

//   const toggleShortlist = async (id) => {
//     console.log("toggleShortlist called", { id });
//     const item = apiData.find((item) => item.artistProfile._id === id);
//     console.log("Found item", item);
//     if (!item) {
//       console.log("Item not found for ID:", id);
//       Alert.alert("Error", "Artist not found");
//       return;
//     }

//     console.log("Removing item from shortlist", { id });
//     try {
//       const response = await axios.delete(
//         `${API_BASE_URL}/host/removeShortlistArtist/${item.artistProfile.artistId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Remove artist API response", response.data);
//       setShortlistedItems((prev) => ({
//         ...prev,
//         [id]: false,
//       }));
//       console.log("Updated shortlistedItems", { [id]: false });
//       setApiData((prev) => prev.filter((i) => i.artistProfile._id !== id));
//       console.log(
//         "Updated apiData",
//         apiData.filter((i) => i.artistProfile._id !== id)
//       );
//       Alert.alert(
//         "Success",
//         `Artist with ID ${item.artistProfile.artistId} removed from shortlist`
//       );
//     } catch (error) {
//       console.error("Error response:", error.response?.data || error.message);
//       Alert.alert(
//         "Error",
//         `Failed to remove artist with ID ${item.artistProfile.artistId}`
//       );
//     }
//     console.log(
//       "Removal process completed for artist ID:",
//       item.artistProfile.artistId
//     );
//   };

//   const renderShortlistItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.eventCard}
//         onPress={() => {
//           console.log(
//             "Navigating to HostPerfomanceDetails from shortlist screen",
//             { artist: item.artistProfile }
//           );
//           navigation.navigate("HostPerfomanceDetails", {
//             artist: item.artistProfile,
//           });
//         }}
//         activeOpacity={0.8}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: item?.artistProfile?.profileImageUrl || null }}
//             style={styles.eventImage}
//             resizeMode="cover"
//             onLoad={() =>
//               console.log(
//                 `Image successfully loaded for item ${item.artistProfile._id || null}`
//               )
//             }
//             onError={(e) =>
//               console.error(
//                 `Failed to load image for item ${item.artistProfile._id}. URI: ${item.artistProfile.profileImageUrl}. Error:`,
//                 e.nativeEvent.error
//               )
//             }
//           />
//           <View style={styles.overlayRow}>
//             <TouchableOpacity
//               style={styles.overlayRemove}
//               onPress={() => {
//                 console.log("Remove from shortlist pressed", {
//                   id: item.artistProfile._id,
//                 });
//                 toggleShortlist(item.artistProfile._id);
//               }}
//             >
//               <Feather name="minus" size={18} color="#fff" />
//             </TouchableOpacity>
//             <View style={[styles.overlayButton, styles.overlayButtonFirst]}>
//               <Text style={styles.overlayButtonText}>
//                 {item?.artistProfile?.genre? item?.artistProfile?.genre[0]?.toUpperCase(): "ARTIST"}
//               </Text>
//             </View>
//             <View style={styles.overlayButton}>
//               <Text
//                 style={styles.overlayButtonText}
//               >{`$${item?.artistProfile?.budget || null}`}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.overlayPlus}
//               onPress={() => {
//                 console.log(
//                   "Add to shortlist pressed, opening add options modal"
//                 );
//                 setSelectedArtist(item.artistProfile);
//                 setAddOptionsModalVisible(true);
//               }}
//             >
//               <Feather name="plus" size={12} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };


//   const renderManageEventCard = ({ item }) => {
//   console.log("renderManageEventCard called", { item });
//   return (
//     <View style={styles.manageEventCardContainer} key={item._id}>
//       <View style={styles.manageEventImageWrapper}>
//         <Image
//           source={
//             item.posterUrl
//               ? { uri: item.posterUrl }
//               : require("../assets/Images/fff.jpg")
//           }
//           style={styles.manageEventImage}
//           resizeMode="cover"
//           onLoad={() => console.log(`Event image loaded for event ${item._id}`)}
//           onError={(e) =>
//             console.error(
//               `Failed to load event image for event ${item._id}. URI: ${item.posterUrl}`,
//               e.nativeEvent.error
//             )
//           }
//         />
//         <View style={styles.manageEventDateBadge}>
//           <Text style={styles.manageEventDateMonth}>
//             {item.formattedDate.split(" ")[0]}
//           </Text>
//           <Text style={styles.manageEventDateDay}>
//             {item.formattedDate.split(" ")[1]}
//           </Text>
//         </View>
//       </View>
//       <Text style={styles.manageEventTitle}>
//         {item.eventName || "Event Name"}
//       </Text>
//       <Text style={{ color: "#fff", textAlign: "center", marginBottom: 4 }}>
//         {item.formattedTime}
//       </Text>
//       <View style={styles.manageEventButtonRow}>
//         <LinearGradient
//           colors={["#B15CDE", "#7952FC"]}
//           start={{ x: 1, y: 0 }}
//           end={{ x: 0, y: 0 }}
//           style={styles.manageEventButtonPurple}
//         >
//           <TouchableOpacity
//             onPress={() => {
//               console.log("Navigating to HostManageEvent", {
//                 eventId: item._id,
//               });
//               navigation.navigate("HostManageEvent", { eventId: item._id });
//             }}
//             style={{
//               width: "100%",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Text style={styles.manageEventButtonTextWhite}>
//               Manage Event
//             </Text>
//           </TouchableOpacity>
//         </LinearGradient>
//         <TouchableOpacity
//           style={styles.manageEventTrashButton}
//           onPress={async () => {
//             console.log("Delete event pressed", { eventId: item._id });
//             if (!item._id) {
//               console.log("No event ID, skipping deletion");
//               return;
//             }
//             try {
//               setManageEventsLoading(true);
//               const response = await axios.delete(
//                 `${API_BASE_URL}/host/events/delete-event/${item._id}`,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                   },
//                 }
//               );

//               setManageEvents((prev) =>
//                 prev.filter((e) => e._id !== item._id)
//               );
             
//               Alert.alert("Success", "Event deleted successfully");
//             } catch (error) {
//               console.error(
//                 "Error deleting event:",
//                 error.response?.data || error.message
//               );
//               Alert.alert("Error", "Failed to delete event");
//             } finally {
//               console.log(
//                 "Delete event completed, manageEventsLoading:",
//                 false
//               );
//               setManageEventsLoading(false);
//             }
//           }}
//         >
//           <Feather
//             name="trash-2"
//             size={dimensions.iconSize}
//             color="#a95eff"
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
//   const fetchExistingEvents = async () => {
//     console.log("fetchExistingEvents called", { token });
//     if (!token) {
//       console.log("No token available, skipping fetch");
//       return;
//     }
//     setExistingEventsLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/host/events/get-all-events`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Existing events API response", response.data);
//       if (response.data.success && Array.isArray(response.data.data)) {
//         console.log("Setting existingEvents", response.data.data);
//         setExistingEvents(response.data.data);
//       } else {
//         console.log("No valid events data, setting empty existingEvents");
//         setExistingEvents([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching existing events:",
//         error.response?.data || error.message
//       );
//       setExistingEvents([]);
//     } finally {
//       console.log(
//         "fetchExistingEvents completed, existingEventsLoading:",
//         false
//       );
//       setExistingEventsLoading(false);
//     }
//   };

 
//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: "#121212",
//           paddingLeft: responsiveDimensions.safeAreaLeft,
//           paddingRight: responsiveDimensions.safeAreaRight,
//         },
//       ]}
//     >
//       <FlatList
//         ListHeaderComponent={
//           <>
//             <Text
//               style={[styles.screenTitle, { color: currentTheme.textColor }]}
//             >
//               {activeTab === "Shortlist" ? "Shortlists" : "Manage Event"}
//             </Text>
//             <View style={styles.dividerLine} />
//             <View style={styles.header}>
//               {activeTab === "Shortlist" ? (
//                 <LinearGradient
//                   colors={["#B15CDE", "#7952FC"]}
//                   start={{ x: 1, y: 0 }}
//                   end={{ x: 0, y: 0 }}
//                   // style={[styles.tab, styles.activeTab]}
//                   style={[styles.tab, styles.activeTab, { marginRight: 8 }]} 
//                 >
//                   <TouchableOpacity
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                     onPress={() => {
//                       console.log("Switching to Shortlist tab");
//                       setActiveTab("Shortlist");
//                     }}
//                     activeOpacity={1}
//                   >
//                     <Text style={[styles.tabText, { color: "#FFF" }]}>
//                       Shortlist{" "}
//                     </Text>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.tab, styles.inactiveTab, { marginRight: 8 }]}
//                   onPress={() => {
//                     console.log("Switching to Shortlist tab");
//                     setActiveTab("Shortlist");
//                   }}
//                 >
//                   <Text style={[styles.tabText, { color: "#B15CDE" }]}>
//                     Shortlist
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               {activeTab === "Manage Event" ? (
//                 <LinearGradient
//                   colors={["#B15CDE", "#7952FC"]}
//                   start={{ x: 1, y: 0 }}
//                   end={{ x: 0, y: 0 }}
//                   style={[styles.tab, styles.activeTab]}
//                 >
//                   <TouchableOpacity
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                     onPress={() => {
//                       console.log("Switching to Manage Event tab");
//                       setActiveTab("Manage Event");
//                     }}
//                     activeOpacity={1}
//                   >
//                     <Text style={[styles.tabText, { color: "#FFF" }]}>
//                       Manage Event 
//                     </Text>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.tab, styles.inactiveTab]}
//                   onPress={() => {
//                     console.log("Switching to Manage Event tab");
//                     setActiveTab("Manage Event");
//                   }}
//                 >
//                   <Text style={[styles.tabText, { color: "#FFF" }]}>
//                     Manage Event{" "}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </>
//         }
//         data={activeTab === "Shortlist" ? apiData : manageEvents}
//         renderItem={
//           activeTab === "Shortlist"
//             ? renderShortlistItem
//             : renderManageEventCard
//         }
//         keyExtractor={(item) => item.artistProfile?._id || item?._id}
//         ListEmptyComponent={
//           !loading && activeTab === "Shortlist" ? (
//             <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
//               No artists found.
//             </Text>
//           ) : !manageEventsLoading && activeTab === "Manage Event" ? (
//             <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
//               No events found.
//             </Text>
//           ) : null
//         }
       

//         contentContainerStyle={{
//           paddingTop: Math.max(
//             responsiveDimensions.safeAreaTop + dimensions.spacing.lg,
//             30
//           ),
//           paddingBottom: Math.max(
//             responsiveDimensions.safeAreaBottom + 100,
//             120
//           ),
//           paddingHorizontal: responsiveDimensions.containerPadding.horizontal,
//           gap: 20,
//         }}
//         showsVerticalScrollIndicator={false}
//         ListFooterComponent={<View style={{ height: 20 }} />}
//         refreshing={loading || manageEventsLoading}
//         onRefresh={() => {
//           if (activeTab === "Shortlist") {
//             fetchShortlistedArtists();
//           } else {
//             fetchManageEvents();
//           }
//         }}
//       />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isAddOptionsModalVisible}
//         onRequestClose={() => {
//           console.log("Closing add options modal");
//           setAddOptionsModalVisible(false);
//         }}
//         statusBarTranslucent
//       >
//         <View style={styles.modalOverlay}>
//           <LinearGradient
//             colors={["#7952FC", "#B15CDE"]}
//             start={{ x: 0.85, y: 1 }}
//             end={{ x: 0, y: 0 }}
//             style={styles.modalContent}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.modalCloseButton,
//                 {
//                   top: dimensions.spacing.lg,
//                   right: Math.max(
//                     responsiveDimensions.safeAreaRight + dimensions.spacing.lg,
//                     dimensions.spacing.lg
//                   ),
//                 },
//               ]}
//               onPress={() => {
//                 console.log("Closing add options modal");
//                 setAddOptionsModalVisible(false);
//               }}
//             >
//               <Feather name="x" size={dimensions.iconSize} color="#fff" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 console.log(
//                   "On Salary Basis pressed, opening contract details modal"
//                 );
//                 setAddOptionsModalVisible(false);
//                 setContractDetailsModalVisible(true);
//               }}
//             >
//               <Text style={styles.modalButtonTextWhite}>On Salary Basis</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 console.log(
//                   "Add To Existing Events pressed, opening existing events modal"
//                 );
//                 setAddOptionsModalVisible(false);
//                 setAddToExistingEventsModalVisible(true);
//                 fetchExistingEvents();
//               }}
//             >
//               <Text style={styles.modalButtonTextWhite}>
//                 Add To Existing Events
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 console.log(
//                   "Navigating to ShortlistCreateNewEvent with artist",
//                   selectedArtist
//                 );
//                 navigation.navigate("ShortlistCreateNewEvent", {
//                   artist: selectedArtist,
//                 });
//                 setAddOptionsModalVisible(false);
//               }}
//             >
//               <Text style={styles.modalButtonTextWhite}>
//                 Create a New Event
//               </Text>
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isContractDetailsModalVisible}
//         onRequestClose={() => {
//           console.log("Closing contract details modal");
//           setContractDetailsModalVisible(false);
//         }}
//         statusBarTranslucent
//       >
//         <View style={styles.modalOverlay}>
//           <View
//             style={[
//               styles.contractDetailsModalContent,
//               {
//                 paddingTop: Math.max(responsiveDimensions.safeAreaTop + 20, 50),
//                 paddingLeft: responsiveDimensions.safeAreaLeft,
//                 paddingRight: responsiveDimensions.safeAreaRight,
//               },
//             ]}
//           >
//             <View
//               style={[
//                 styles.contractDetailsHeader,
//                 {
//                   paddingHorizontal: Math.max(
//                     responsiveDimensions.safeAreaLeft + dimensions.spacing.lg,
//                     dimensions.spacing.lg
//                   ),
//                   marginLeft: responsiveDimensions.safeAreaLeft,
//                   marginRight: responsiveDimensions.safeAreaRight,
//                 },
//               ]}
//             >
//               <TouchableOpacity
//                 onPress={() => {
//                   console.log(
//                     "Back button pressed, closing contract details modal"
//                   );
//                   setContractDetailsModalVisible(false);
//                 }}
//                 style={styles.backButtonContainer}
//               >
//                 <Feather
//                   name="arrow-left"
//                   size={dimensions.iconSize}
//                   color="#fff"
//                 />
//               </TouchableOpacity>
//               <Text
//                 style={[
//                   styles.contractDetailsHeaderTitle,
//                   {
//                     marginRight: 180,
//                   },
//                 ]}
//               >
//                 Contract Details
//               </Text>
//               <View style={{ width: dimensions.iconSize }} />
//             </View>

//             <ScrollView
//               contentContainerStyle={[
//                 styles.contractDetailsScrollViewContent,
//                 {
//                   paddingBottom: Math.max(
//                     responsiveDimensions.safeAreaBottom + 40,
//                     60
//                   ),
//                   paddingHorizontal: Math.max(
//                     responsiveDimensions.safeAreaLeft + dimensions.spacing.lg,
//                     dimensions.spacing.lg
//                   ),
//                 },
//               ]}
//             >
//               <Text style={styles.contractDetailsSectionTitle}>
//                 Working Hours:
//               </Text>
//               <Text style={styles.contractDetailsText}>
//                 You will be working from the Restaurant for 6 days a week.
//                 However, we may occasionally schedule additional sales events,
//                 seminars, or meetings during the holidays.
//               </Text>

//               <Text style={styles.contractDetailsText}>
//                 The regular working hours will be 1:00 p.m. to 11:00 p.m with 1
//                 hour of break.
//               </Text>

//               <Text style={styles.contractDetailsText}>
//                 All employees will be required to work in shifts and/or extended
//                 hours as permitted by law.
//               </Text>

//               <Text style={styles.contractDetailsText}>
//                 You may be required to work beyond your existing working hours
//                 depending upon the business requirements/exigencies from time to
//                 time. However, For, overtime work charges can be determined by
//                 involved parties.
//               </Text>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isAddToExistingEventsModalVisible}
//         onRequestClose={() => {
//           console.log("Closing add to existing events modal");
//           setAddToExistingEventsModalVisible(false);
//         }}
//         statusBarTranslucent
//       >
//         <View style={styles.addToExistingModalOverlay}>
//           <LinearGradient
//             colors={["#B15CDE", "#7952FC"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//             style={[
//               styles.addToExistingModalGradient,
//               {
//                 marginTop: Math.max(
//                   responsiveDimensions.safeAreaTop + height * 0.15,
//                   120
//                 ),
//                 paddingBottom: Math.max(
//                   responsiveDimensions.safeAreaBottom + 30,
//                   50
//                 ),
//                 paddingLeft: responsiveDimensions.safeAreaLeft,
//                 paddingRight: responsiveDimensions.safeAreaRight,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.addToExistingModalCloseButton,
//                 {
//                   top: Math.max(
//                     responsiveDimensions.safeAreaTop + dimensions.spacing.md,
//                     dimensions.spacing.md
//                   ),
//                   right: Math.max(
//                     responsiveDimensions.safeAreaRight + dimensions.spacing.md,
//                     dimensions.spacing.md
//                   ),
//                 },
//               ]}
//               onPress={() => {
//                 console.log("Closing add to existing events modal");
//                 setAddToExistingEventsModalVisible(false);
//               }}
//             >
//               <Feather name="x" size={dimensions.iconSize} color="#000" />
//             </TouchableOpacity>
//             {existingEventsLoading ? (
//               <ActivityIndicator
//                 size="large"
//                 color="#a95eff"
//                 style={{ marginTop: 20 }}
//               />
//             ) : existingEvents.length > 0 ? (
//               existingEvents.map((item) => {
//                 console.log("Rendering existing event card", { item });
//                 return (
//                   <TouchableOpacity
//                     key={item._id}
//                     style={styles.existingEventCard}
//                     onPress={() => {
//                       console.log("Navigating to HostDetailBookingScreen", {
//                         timestamp: new Date().toISOString(),
//                         eventId: item._id,
//                         artist: selectedArtist,
//                       });
//                       navigation.navigate("HostDetailBooking", {
//                         eventId: item._id,
//                         artist: selectedArtist,
//                       });
//                       setAddToExistingEventsModalVisible(false);
//                     }}
//                     activeOpacity={0.8}
//                   >
//                     <Image
//                       source={
//                         item.posterUrl
//                           ? { uri: item.posterUrl }
//                           : require("../assets/Images/fff.jpg")
//                       }
//                       style={styles.existingEventImage}
//                       onLoad={() =>
//                         console.log(
//                           `Existing event image loaded for event ${item._id}`
//                         )
//                       }
//                       onError={(e) =>
//                         console.error(
//                           `Failed to load existing event image for event ${item._id}. URI: ${item.posterUrl}`,
//                           e.nativeEvent.error
//                         )
//                       }
//                     />
//                     <View style={styles.existingEventDetails}>
//                       <Text style={styles.existingEventTitle}>
//                         {item.eventName}
//                       </Text>
//                       <Text style={styles.existingEventDescription}>
//                         Join us for an unforgettable evening filled with live
//                         music! Feel the beat and excitement!
//                       </Text>
//                       <Text style={{ color: "#a95eff", fontSize: 10 }}>
//                         {item.eventDate && item.eventDate[0]
//                           ? new Date(item.eventDate[0]).toLocaleString(
//                               "en-US",
//                               { month: "short", day: "2-digit" }
//                             )
//                           : ""}{" "}
//                         | {item.eventTime}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               })
//             ) : (
//               <Text
//                 style={{ color: "#fff", textAlign: "center", marginTop: 40 }}
//               >
//                 No events found.
//               </Text>
//             )}
//           </LinearGradient>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   screenTitle: {
//     fontFamily: "Nunito Sans",
//     fontSize: 18,
//     fontStyle: "normal",
//     fontWeight: "700",
//     lineHeight: 24,
//     color: "#C6C5ED",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     marginTop: dimensions.spacing.md,
//     marginBottom: dimensions.spacing.md,
//   },
//   dividerLine: {
//     height: 1,
//     backgroundColor: "#2d2d3a",
//     width: "100%",
//     marginBottom: dimensions.spacing.xl,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     paddingVertical: dimensions.spacing.md,
//     marginBottom: 4,
//     gap: 0,
//   },
//   tab: {
//     flex: 1,
//     height: 52,
//     paddingVertical: 0,
//     paddingHorizontal: 16,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "stretch",
//     shadowColor: "rgba(177, 92, 222, 0.15)",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   activeTab: {
//     flex: 1,
//     borderWidth: 0,
//   },
//   inactiveTab: {
//     flex: 1,
//     height: 52,
//     paddingVertical: 0,
//     paddingHorizontal: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#34344A",
//     backgroundColor: "#1A1A1F",
//   },
//   tabText: {
//     color: "#C6C5ED",
//     textAlign: "center",
//     fontFamily: "Nunito Sans",
//     fontSize: 12,
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: 21,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
//   title: {
//     fontSize: dimensions.fontSize.large,
//     fontWeight: "600",
//     marginVertical: dimensions.spacing.lg,
//   },
//   listContainer: {
//     paddingBottom: dimensions.spacing.md,
//   },
//   eventCard: {
//     marginBottom: dimensions.spacing.lg,
//     borderRadius: dimensions.borderRadius.lg,
//     overflow: "hidden",
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   eventImage: {
//     width: "100%",
//     height: dimensions.imageHeight,
//   },
//   overlayRow: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   overlayButton: {
//     backgroundColor: "rgba(255,255,255,0.20)",
//     borderRadius: 30,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     minWidth: 100,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   overlayButtonFirst: {},
//   overlayButtonText: {
//     color: "#FFF",
//     fontFamily: "Inter",
//     fontSize: 10,
//     fontStyle: "normal",
//     fontWeight: "500",
//     lineHeight: 15,
//     textTransform: "uppercase",
//   },
//   overlayPlus: {
//     backgroundColor: "#a95eff",
//     borderRadius: 20,
//     padding: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 0,
//   },
//   manageEventTabContent: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     marginTop: dimensions.spacing.xxl,
//   },
//   manageEventCardContainer: {
//     display: "flex",
//     width: 320,
//     minWidth: 200,
//     maxWidth: 400,
//     padding: 12,
//     alignItems: "flex-start",
//     alignContent: "flex-start",
//     gap: 10,
//     flexWrap: "wrap",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "rgba(252, 252, 253, 0.12)",
//     backgroundColor: "transparent",
//     overflow: "hidden",
//     shadowColor: "#0F0F0F",
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.1,
//     shadowRadius: 32,
//     elevation: 6,
//     marginTop: 0,
//   },
//   manageEventImageWrapper: {
//     width: "100%",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 12,
//     position: "relative",
//   },
//   manageEventImage: {
//     width: "100%",
//     height: 120,
//     borderRadius: 12,
//   },
//   manageEventDateBadge: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     backgroundColor: "#181828",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     alignItems: "center",
//     zIndex: 2,
//   },
//   manageEventDateMonth: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "600",
//     lineHeight: 12,
//   },
//   manageEventDateDay: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//     lineHeight: 18,
//   },
//   manageEventTitle: {
//     color: "#FCFCFD",
//     textAlign: "center",
//     fontFamily: "Inter",
//     fontSize: 20,
//     fontStyle: "normal",
//     fontWeight: "600",
//     lineHeight: 24,
//     marginTop: 2,
//     marginBottom: 10,
//     alignSelf: "center",
//     paddingRight: 80,
//   },
//   manageEventButtonRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginTop: 4,
//   },
//   manageEventButtonPurple: {
//     flex: 1,
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//     marginRight: 8,
//     minHeight: 36,
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   manageEventButtonTextWhite: {
//     color: "#fff",
//     textAlign: "center",
//     fontFamily: "Nunito Sans",
//     fontSize: 12,
//     fontStyle: "normal",
//     fontWeight: "500",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
//   manageEventTrashButton: {
//     borderWidth: 1.2,
//     borderColor: "#a95eff",
//     borderRadius: 8,
//     padding: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     minWidth: 36,
//     minHeight: 36,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     width: 393,
//     height: 272,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     alignItems: "center",
//     position: "relative",
//     padding: 24,
//     backgroundColor: "#8D6BFC",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -15 },
//     shadowOpacity: 0.4,
//     shadowRadius: 34,
//     elevation: 10,
//     alignSelf: "center",
//     maxWidth: "100%",
//     marginHorizontal: 0,
//   },
//   modalCloseButton: {
//     position: "absolute",
//     backgroundColor: "#a95eff",
//     borderRadius: dimensions.borderRadius.xl,
//     width: Math.max(width * 0.1, 40),
//     height: Math.max(width * 0.1, 40),
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1,
//   },
//   modalButton: {
//     width: "95%",
//     paddingVertical: dimensions.spacing.lg,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: dimensions.spacing.lg,
//     backgroundColor: "transparent",
//     minHeight: dimensions.buttonHeight,
//     justifyContent: "center",
//     borderColor: "#FFF",
//     borderWidth: 1,
//   },
//   modalButtonWhite: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#FFF",
//   },
//   modalButtonTextWhite: {
//     color: "#fff",
//     textAlign: "center",
//     fontFamily: "Nunito Sans",
//     fontSize: 13,
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: 21,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
//   modalButtonTextPurple: {
//     color: "#a95eff",
//     fontSize: dimensions.fontSize.header,
//     fontWeight: "600",
//   },
//   contractDetailsModalContent: {
//     flex: 1,
//     backgroundColor: "#111018",
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//   },
//   contractDetailsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: dimensions.spacing.md,
//     borderBottomWidth: 1,
//     borderColor: "#2d2d3a",
//     minHeight: Math.max(height * 0.08, 60),
//   },
//   backButtonContainer: {
//     minWidth: dimensions.iconSize,
//     minHeight: dimensions.iconSize,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   contractDetailsHeaderTitle: {
//     color: "#fff",
//     fontFamily: "Nunito Sans",
//     fontSize: 15,
//     fontStyle: "normal",
//     fontWeight: "680",
//     lineHeight: 24,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     textAlign: "left",
//     marginLeft: 12,
//   },
//   contractDetailsScrollViewContent: {
//     paddingVertical: dimensions.spacing.xl,
//   },
//   contractDetailsSectionTitle: {
//     color: "#C1C1C1",
//     fontFamily: "Poppins",
//     fontSize: 14,
//     fontStyle: "normal",
//     fontWeight: "700",
//     lineHeight: 25,
//     marginBottom: dimensions.spacing.sm,
//     marginTop: dimensions.spacing.lg,
//   },
//   contractDetailsText: {
//     color: "#838383",
//     fontFamily: "Poppins",
//     fontSize: 14,
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: 25,
//     marginBottom: dimensions.spacing.md,
//   },
//   addToExistingModalOverlay: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "stretch",
//   },
//   addToExistingModalGradient: {
//     flex: 1,
//     borderTopLeftRadius: dimensions.borderRadius.xl,
//     borderTopRightRadius: dimensions.borderRadius.xl,
//     overflow: "hidden",
//     marginHorizontal: 0,
//     paddingTop: Math.max(height * 0.08, 60),
//     position: "relative",
//     minHeight: Math.max(height * 0.5, 400),
//   },
//   addToExistingModalCloseButton: {
//     position: "absolute",
//     backgroundColor: "#fff",
//     borderRadius: dimensions.borderRadius.xl,
//     width: Math.max(width * 0.1, 40),
//     height: Math.max(width * 0.1, 40),
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 2,
//   },
//   existingEventListContainer: {
//     paddingTop: 0,
//     paddingBottom: 0,
//   },
//   existingEventCard: {
//     display: "flex",
//     flexDirection: "row",
//     height: 92,
//     paddingTop: 6,
//     paddingBottom: 6,
//     paddingLeft: 6,
//     paddingRight: 13,
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "stretch",
//     borderRadius: 8,
//     backgroundColor: "#F6F8FA",
//     marginBottom: dimensions.spacing.md,
//     overflow: "hidden",
//     borderWidth: 0,
//   },
//   existingEventImage: {
//     width: 78,
//     height: 80,
//     borderRadius: 4,
//     marginRight: dimensions.spacing.md,
//     backgroundColor: "#9A1E25",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4.8 },
//     shadowOpacity: 0.1,
//     shadowRadius: 28.8,
//   },
//   existingEventDetails: {
//     flex: 1,
//     padding: dimensions.spacing.md,
//     justifyContent: "space-between",
//   },
//   existingEventTitle: {
//     color: "#000",
//     fontFamily: "Poppins",
//     fontSize: 12,
//     fontStyle: "normal",
//     fontWeight: "700",
//     lineHeight: undefined,
//     marginTop: 9,
//     marginBottom: dimensions.spacing.xs,
//   },
//   existingEventDescription: {
//     color: "#646465",
//     fontFamily: "Inter",
//     fontSize: 10,
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: 15,
//     marginBottom: dimensions.spacing.sm,
//   },
//   headerFixed: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 16,
//     width: 393,
//     height: 112,
//     padding: 16,
//     flexShrink: 0,
//     borderBottomWidth: 1,
//     borderBottomColor: "#C6C5ED",
//     shadowColor: "#683BFC",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 4,
//     backgroundColor: "#121212",
//     marginBottom: 0,
//   },
// });

// export default ShortlistScreen;



import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../Config/env";
import api from "../Config/api";

const { width, height } = Dimensions.get("window");

const isTablet = width >= 768;
const isSmallPhone = width < 350;

const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 8),
    md: Math.max(width * 0.03, 12),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  fontSize: {
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 5),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.03, 12),
    xl: Math.max(width * 0.06, 20),
    xxl: Math.max(width * 0.08, 30),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.min(width * 0.55, height * 0.3),
  cardPadding: Math.max(width * 0.03, 12),
};

const ShortlistScreen = ({ navigation }) => {
  const [theme, setTheme] = useState("dark");
  const [shortlistedItems, setShortlistedItems] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Shortlist");
  const [isAddOptionsModalVisible, setAddOptionsModalVisible] = useState(false);
  const [isContractDetailsModalVisible, setContractDetailsModalVisible] =
    useState(false);
  const [
    isAddToExistingEventsModalVisible,
    setAddToExistingEventsModalVisible,
  ] = useState(false);
  const [manageEvents, setManageEvents] = useState([]);
  const [manageEventsLoading, setManageEventsLoading] = useState(false);
  const [existingEvents, setExistingEvents] = useState([]);
  const [existingEventsLoading, setExistingEventsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const insets = useSafeAreaInsets();

  console.log("ShortlistScreen initialized", {
    theme,
    token,
    activeTab,
    insets,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchShortlistedArtists = async () => {
        if (!token) {
          console.log("No token available, skipping API call");
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          console.log('Fetching shortlisted artists from API', {
            url: 'http://10.0.2.2:3000/api/host/getShortlistedArtists',
            headers: { Authorization: `Bearer ${token}` },
          });
          const response = await axios.get('http://10.0.2.2:3000/api/host/getShortlistedArtists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Shortlisted artists API response', response.data);
          if (response.data.success && Array.isArray(response.data.data)) {
            console.log('Setting apiData', response.data.data);
            setApiData(response.data.data);
            const initialStatus = {};
            response?.data?.data.forEach((item) => {
              initialStatus[item?.artistProfile?._id] = true;
            });
            console.log("Setting shortlistedItems", initialStatus);
            setShortlistedItems(initialStatus);
          } else {
            console.error(
              "Failed to fetch shortlisted artists:",
              response.data.message
            );
            setApiData([]);
          }
        } catch (error) {
          console.error(
            "API error fetching shortlisted artists:",
            error.response?.data || error.message
          );
          setApiData([]);
        } finally {
          console.log("fetchShortlistedArtists completed, loading:", false);
          setLoading(false);
        }
      };
      if (activeTab === "Shortlist") {
        console.log("Active tab is Shortlist, calling fetchShortlistedArtists");
        fetchShortlistedArtists();
      }
    }, [token, activeTab])
  );

  const formatEventDate = (dateArr) => {
    console.log("formatEventDate called", { dateArr });
    if (!Array.isArray(dateArr) || !dateArr[0]) {
      console.log("Invalid date array, returning empty string");
      return "";
    }
    const date = new Date(dateArr[0]);
    if (isNaN(date)) {
      console.log("Invalid date, returning empty string");
      return "";
    }
    const formatted = `${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getDate()}`;
    console.log("Formatted date", formatted);
    return formatted;
  };

  const formatEventTime = (eventTime) => {
    console.log("formatEventTime called", { eventTime });
    if (!eventTime) {
      console.log("No event time, returning empty string");
      return "";
    }
    console.log("Formatted time", eventTime);
    return eventTime;
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchManageEvents = async () => {
        console.log("fetchManageEvents called", { token, activeTab });
        if (!token) {
          console.log("No token available, setting empty manageEvents");
          setManageEvents([]);
          setManageEventsLoading(false);
          return;
        }
        if (activeTab !== "Manage Event") {
          console.log("Active tab is not Manage Event, skipping fetch");
          return;
        }
        setManageEventsLoading(true);
        try {
          console.log('Fetching events from API', {
            url: 'http://10.0.2.2:3000/api/host/events/get-all-events',
            headers: { Authorization: `Bearer ${token}` },
          });
          const response = await axios.get('http://10.0.2.2:3000/api/host/events/get-all-events', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Manage events API response', response.data);
          if (response.data.success && Array.isArray(response.data.data)) {
            const mappedEvents = response.data.data.map((event) => ({
              ...event,
              formattedDate: formatEventDate(event.eventDateTime),
              formattedTime: formatEventTime(event.eventTime),
            }));
            console.log("Mapped events", mappedEvents);
            setManageEvents(mappedEvents);
          } else {
            console.log("No valid events data, setting empty manageEvents");
            setManageEvents([]);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setManageEvents([]);
        } finally {
          console.log("fetchManageEvents completed, manageEventsLoading:", false);
          setManageEventsLoading(false);
        }
      };
      fetchManageEvents();
    }, [token, activeTab])
  );

  const responsiveDimensions = {
    ...dimensions,
    safeAreaTop: Math.max(insets.top, 0),
    safeAreaBottom: Math.max(insets.bottom, 0),
    safeAreaLeft: Math.max(insets.left, 0),
    safeAreaRight: Math.max(insets.right, 0),
    containerPadding: {
      horizontal: Math.max(
        insets.left + dimensions.spacing.md,
        dimensions.spacing.md
      ),
      vertical: Math.max(
        insets.top + dimensions.spacing.sm,
        dimensions.spacing.sm
      ),
    },
  };

  console.log("Responsive dimensions calculated", responsiveDimensions);

  const themes = {
    dark: {
      backgroundColor: "#000",
      textColor: "#fff",
      subColor: "#ccc",
      cardBackground: "#1a1a1a",
      activeTabBackground: "#a95eff",
      navBackground: "#1a1a1a",
    },
    light: {
      backgroundColor: "#fff",
      textColor: "#000",
      subColor: "#666",
      cardBackground: "#f0f0f0",
      activeTabBackground: "#a95eff",
      navBackground: "#e0e0e0",
    },
  };

  const currentTheme = themes[theme];
  console.log("Current theme", currentTheme);

  const toggleShortlist = async (id) => {
    console.log("toggleShortlist called", { id });
    const item = apiData.find((item) => item.artistProfile._id === id);
    console.log("Found item", item);
    if (!item) {
      console.log("Item not found for ID:", id);
      Alert.alert("Error", "Artist not found");
      return;
    }

    console.log("Removing item from shortlist", { id });
    try {
      console.log('Sending DELETE request', {
        url: `http://10.0.2.2:3000/api/host/removeShortlistArtist/${item.artistProfile.artistId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.delete(`http://10.0.2.2:3000/api/host/removeShortlistArtist/${item.artistProfile.artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Remove artist API response', response.data);
      setShortlistedItems((prev) => ({
        ...prev,
        [id]: false,
      }));
      console.log("Updated shortlistedItems", { [id]: false });
      setApiData((prev) => prev.filter((i) => i.artistProfile._id !== id));
      console.log(
        "Updated apiData",
        apiData.filter((i) => i.artistProfile._id !== id)
      );
      Alert.alert(
        "Success",
        `Artist with ID ${item.artistProfile.artistId} removed from shortlist`
      );
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        `Failed to remove artist with ID ${item.artistProfile.artistId}`
      );
    }
    console.log(
      "Removal process completed for artist ID:",
      item.artistProfile.artistId
    );
  };

  const renderShortlistItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          console.log(
            "Navigating to HostPerfomanceDetails from shortlist screen",
            { artist: item.artistProfile }
          );
          navigation.navigate("HostPerfomanceDetails", {
            artist: item.artistProfile,
          });
        }}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.artistProfile?.profileImageUrl || null }}
            style={styles.eventImage}
            resizeMode="cover"
            onLoad={() =>
              console.log(
                `Image successfully loaded for item ${item.artistProfile._id || null}`
              )
            }
            onError={(e) =>
              console.error(
                `Failed to load image for item ${item.artistProfile._id}. URI: ${item.artistProfile.profileImageUrl}. Error:`,
                e.nativeEvent.error
              )
            }
          />
          <View style={styles.overlayRow}>
            <TouchableOpacity
              style={styles.overlayRemove}
              onPress={() => {
                console.log("Remove from shortlist pressed", {
                  id: item.artistProfile._id,
                });
                toggleShortlist(item.artistProfile._id);
              }}
            >
              <Feather name="minus" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.overlayButton, styles.overlayButtonFirst]}>
              <Text style={styles.overlayButtonText}>
                {item?.artistProfile?.genre
                  ? item?.artistProfile?.genre[0]?.toUpperCase()
                  : "ARTIST"}
              </Text>
            </View>
            <View style={styles.overlayButton}>
              <Text
                style={styles.overlayButtonText}
              >{`$${item?.artistProfile?.budget || null}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.overlayPlus}
              onPress={() => {
                console.log(
                  "Add to shortlist pressed, opening add options modal"
                );
                setSelectedArtist(item.artistProfile);
                setAddOptionsModalVisible(true);
              }}
            >
              <Feather name="plus" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderManageEventCard = ({ item }) => {
    console.log("renderManageEventCard called", { item });
    return (
      <View style={styles.manageEventCardContainer} key={item._id}>
        <View style={styles.manageEventImageWrapper}>
          <Image
            source={
              item.posterUrl
                ? { uri: item.posterUrl }
                : require("../assets/Images/fff.jpg")
            }
            style={styles.manageEventImage}
            resizeMode="cover"
            onLoad={() => console.log(`Event image loaded for event ${item._id}`)}
            onError={(e) =>
              console.error(
                `Failed to load event image for event ${item._id}. URI: ${item.posterUrl}`,
                e.nativeEvent.error
              )
            }
          />
          <View style={styles.manageEventDateBadge}>
            <Text style={styles.manageEventDateMonth}>
              {item.formattedDate.split(" ")[0]}
            </Text>
            <Text style={styles.manageEventDateDay}>
              {item.formattedDate.split(" ")[1]}
            </Text>
          </View>
        </View>
        <Text style={styles.manageEventTitle}>
          {item.eventName || "Event Name"}
        </Text>
        <Text style={{ color: "#fff", textAlign: "center", marginBottom: 4 }}>
          {item.formattedTime}
        </Text>
        <View style={styles.manageEventButtonRow}>
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.manageEventButtonPurple}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Navigating to HostManageEvent", {
                  eventId: item._id,
                });
                navigation.navigate("HostManageEvent", { eventId: item._id });
              }}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.manageEventButtonTextWhite}>
                Manage Event
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            style={styles.manageEventTrashButton}
            onPress={async () => {
              console.log("Delete event pressed", { eventId: item._id });
              if (!item._id) {
                console.log("No event ID, skipping deletion");
                return;
              }
              try {
                console.log('Sending DELETE request for event', {
                  url: `http://10.0.2.2:3000/api/host/events/delete-event/${event._id}`,
                  headers: { Authorization: `Bearer ${token}` },
                });
                setManageEventsLoading(true);
                const response = await axios.delete(
                  `http://10.0.2.2:3000/api/host/events/delete-event/${event._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                setManageEvents((prev) =>
                  prev.filter((e) => e._id !== item._id)
                );
                Alert.alert("Success", "Event deleted successfully");
              } catch (error) {
                console.error(
                  "Error deleting event:",
                  error.response?.data || error.message
                );
                Alert.alert("Error", "Failed to delete event");
              } finally {
                console.log(
                  "Delete event completed, manageEventsLoading:",
                  false
                );
                setManageEventsLoading(false);
              }
            }}
          >
            <Feather
              name="trash-2"
              size={dimensions.iconSize}
              color="#a95eff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const fetchExistingEvents = async () => {
    console.log("fetchExistingEvents called", { token });
    if (!token) {
      console.log("No token available, skipping fetch");
      return;
    }
    setExistingEventsLoading(true);
    try {
      console.log('Fetching existing events from API', {
        url: 'http://10.0.2.2:3000/api/host/events/get-all-events',
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get('http://10.0.2.2:3000/api/host/events/get-all-events', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Existing events API response', response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log("Setting existingEvents", response.data.data);
        setExistingEvents(response.data.data);
      } else {
        console.log("No valid events data, setting empty existingEvents");
        setExistingEvents([]);
      }
    } catch (error) {
      console.error(
        "Error fetching existing events:",
        error.response?.data || error.message
      );
      setExistingEvents([]);
    } finally {
      console.log(
        "fetchExistingEvents completed, existingEventsLoading:",
        false
      );
      setExistingEventsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#121212",
          paddingLeft: responsiveDimensions.safeAreaLeft,
          paddingRight: responsiveDimensions.safeAreaRight,
        },
      ]}
    >
      <FlatList
        ListHeaderComponent={
          <>
            <Text
              style={[styles.screenTitle, { color: currentTheme.textColor }]}
            >
              {activeTab === "Shortlist" ? "Shortlists" : "Manage Event"}
            </Text>
            <View style={styles.dividerLine} />
            <View style={styles.header}>
              {activeTab === "Shortlist" ? (
                <LinearGradient
                  colors={["#B15CDE", "#7952FC"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={[styles.tab, styles.activeTab, { marginRight: 8 }]}
                >
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      console.log("Switching to Shortlist tab");
                      setActiveTab("Shortlist");
                    }}
                    activeOpacity={1}
                  >
                    <Text style={[styles.tabText, { color: "#FFF" }]}>
                      Shortlist{" "}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  style={[styles.tab, styles.inactiveTab, { marginRight: 8 }]}
                  onPress={() => {
                    console.log("Switching to Shortlist tab");
                    setActiveTab("Shortlist");
                  }}
                >
                  <Text style={[styles.tabText, { color: "#B15CDE" }]}>
                    Shortlist
                  </Text>
                </TouchableOpacity>
              )}
              {activeTab === "Manage Event" ? (
                <LinearGradient
                  colors={["#B15CDE", "#7952FC"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={[styles.tab, styles.activeTab]}
                >
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      console.log("Switching to Manage Event tab");
                      setActiveTab("Manage Event");
                    }}
                    activeOpacity={1}
                  >
                    <Text style={[styles.tabText, { color: "#FFF" }]}>
                      Manage Event{" "}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  style={[styles.tab, styles.inactiveTab]}
                  onPress={() => {
                    console.log("Switching to Manage Event tab");
                    setActiveTab("Manage Event");
                  }}
                >
                  <Text style={[styles.tabText, { color: "#FFF" }]}>
                    Manage Event{" "}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        data={activeTab === "Shortlist" ? apiData : manageEvents}
        renderItem={
          activeTab === "Shortlist"
            ? renderShortlistItem
            : renderManageEventCard
        }
        keyExtractor={(item) => item.artistProfile?._id || item?._id}
        ListEmptyComponent={
          !loading && activeTab === "Shortlist" ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
              No artists found.
            </Text>
          ) : !manageEventsLoading && activeTab === "Manage Event" ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
              No events found.
            </Text>
          ) : null
        }
        contentContainerStyle={{
          paddingTop: Math.max(
            responsiveDimensions.safeAreaTop + dimensions.spacing.lg,
            30
          ),
          paddingBottom: Math.max(
            responsiveDimensions.safeAreaBottom + 100,
            120
          ),
          paddingHorizontal: responsiveDimensions.containerPadding.horizontal,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20 }} />}
        refreshing={loading || manageEventsLoading}
        onRefresh={() => {
          if (activeTab === "Shortlist") {
            fetchShortlistedArtists();
          } else {
            fetchManageEvents();
          }
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddOptionsModalVisible}
        onRequestClose={() => {
          console.log("Closing add options modal");
          setAddOptionsModalVisible(false);
        }}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#7952FC", "#B15CDE"]}
            start={{ x: 0.85, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.modalContent}
          >
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  top: dimensions.spacing.lg,
                  right: Math.max(
                    responsiveDimensions.safeAreaRight + dimensions.spacing.lg,
                    dimensions.spacing.lg
                  ),
                },
              ]}
              onPress={() => {
                console.log("Closing add options modal");
                setAddOptionsModalVisible(false);
              }}
            >
              <Feather name="x" size={dimensions.iconSize} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log(
                  "On Salary Basis pressed, opening contract details modal"
                );
                setAddOptionsModalVisible(false);
                setContractDetailsModalVisible(true);
              }}
            >
              <Text style={styles.modalButtonTextWhite}>On Salary Basis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log(
                  "Add To Existing Events pressed, opening existing events modal"
                );
                setAddOptionsModalVisible(false);
                setAddToExistingEventsModalVisible(true);
                fetchExistingEvents();
              }}
            >
              <Text style={styles.modalButtonTextWhite}>
                Add To Existing Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log(
                  "Navigating to ShortlistCreateNewEvent with artist",
                  selectedArtist
                );
                navigation.navigate("ShortlistCreateNewEvent", {
                  artist: selectedArtist,
                });
                setAddOptionsModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonTextWhite}>
                Create a New Event
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isContractDetailsModalVisible}
        onRequestClose={() => {
          console.log("Closing contract details modal");
          setContractDetailsModalVisible(false);
        }}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.contractDetailsModalContent,
              {
                paddingTop: Math.max(responsiveDimensions.safeAreaTop + 20, 50),
                paddingLeft: responsiveDimensions.safeAreaLeft,
                paddingRight: responsiveDimensions.safeAreaRight,
              },
            ]}
          >
            <View
              style={[
                styles.contractDetailsHeader,
                {
                  paddingHorizontal: Math.max(
                    responsiveDimensions.safeAreaLeft + dimensions.spacing.lg,
                    dimensions.spacing.lg
                  ),
                  marginLeft: responsiveDimensions.safeAreaLeft,
                  marginRight: responsiveDimensions.safeAreaRight,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  console.log(
                    "Back button pressed, closing contract details modal"
                  );
                  setContractDetailsModalVisible(false);
                }}
                style={styles.backButtonContainer}
              >
                <Feather
                  name="arrow-left"
                  size={dimensions.iconSize}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.contractDetailsHeaderTitle,
                  {
                    marginRight: 180,
                  },
                ]}
              >
                Contract Details
              </Text>
              <View style={{ width: dimensions.iconSize }} />
            </View>

            <ScrollView
              contentContainerStyle={[
                styles.contractDetailsScrollViewContent,
                {
                  paddingBottom: Math.max(
                    responsiveDimensions.safeAreaBottom + 40,
                    60
                  ),
                  paddingHorizontal: Math.max(
                    responsiveDimensions.safeAreaLeft + dimensions.spacing.lg,
                    dimensions.spacing.lg
                  ),
                },
              ]}
            >
              <Text style={styles.contractDetailsSectionTitle}>
                Working Hours:
              </Text>
              <Text style={styles.contractDetailsText}>
                You will be working from the Restaurant for 6 days a week.
                However, we may occasionally schedule additional sales events,
                seminars, or meetings during the holidays.
              </Text>

              <Text style={styles.contractDetailsText}>
                The regular working hours will be 1:00 p.m. to 11:00 p.m with 1
                hour of break.
              </Text>

              <Text style={styles.contractDetailsText}>
                All employees will be required to work in shifts and/or extended
                hours as permitted by law.
              </Text>

              <Text style={styles.contractDetailsText}>
                You may be required to work beyond your existing working hours
                depending upon the business requirements/exigencies from time to
                time. However, For, overtime work charges can be determined by
                involved parties.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddToExistingEventsModalVisible}
        onRequestClose={() => {
          console.log("Closing add to existing events modal");
          setAddToExistingEventsModalVisible(false);
        }}
        statusBarTranslucent
      >
        <View style={styles.addToExistingModalOverlay}>
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.addToExistingModalGradient,
              {
                marginTop: Math.max(
                  responsiveDimensions.safeAreaTop + height * 0.15,
                  120
                ),
                paddingBottom: Math.max(
                  responsiveDimensions.safeAreaBottom + 30,
                  50
                ),
                paddingLeft: responsiveDimensions.safeAreaLeft,
                paddingRight: responsiveDimensions.safeAreaRight,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.addToExistingModalCloseButton,
                {
                  top: Math.max(
                    responsiveDimensions.safeAreaTop + dimensions.spacing.md,
                    dimensions.spacing.md
                  ),
                  right: Math.max(
                    responsiveDimensions.safeAreaRight + dimensions.spacing.md,
                    dimensions.spacing.md
                  ),
                },
              ]}
              onPress={() => {
                console.log("Closing add to existing events modal");
                setAddToExistingEventsModalVisible(false);
              }}
            >
              <Feather name="x" size={dimensions.iconSize} color="#000" />
            </TouchableOpacity>
            {existingEventsLoading ? (
              <ActivityIndicator
                size="large"
                color="#a95eff"
                style={{ marginTop: 20 }}
              />
            ) : existingEvents.length > 0 ? (
              existingEvents.map((item) => {
                console.log("Rendering existing event card", { item });
                return (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.existingEventCard}
                    onPress={() => {
                      console.log("Navigating to HostDetailBookingScreen", {
                        timestamp: new Date().toISOString(),
                        eventId: item._id,
                        artist: selectedArtist,
                      });
                      navigation.navigate("HostDetailBooking", {
                        eventId: item._id,
                        artist: selectedArtist,
                      });
                      setAddToExistingEventsModalVisible(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={
                        item.posterUrl
                          ? { uri: item.posterUrl }
                          : require("../assets/Images/fff.jpg")
                      }
                      style={styles.existingEventImage}
                      onLoad={() =>
                        console.log(
                          `Existing event image loaded for event ${item._id}`
                        )
                      }
                      onError={(e) =>
                        console.error(
                          `Failed to load existing event image for event ${item._id}. URI: ${item.posterUrl}`,
                          e.nativeEvent.error
                        )
                      }
                    />
                    <View style={styles.existingEventDetails}>
                      <Text style={styles.existingEventTitle}>
                        {item.eventName}
                      </Text>
                      <Text style={styles.existingEventDescription}>
                        Join us for an unforgettable evening filled with live
                        music! Feel the beat and excitement!
                      </Text>
                      <Text style={{ color: "#a95eff", fontSize: 10 }}>
                        {item.eventDate && item.eventDate[0]
                          ? new Date(item.eventDate[0]).toLocaleString(
                              "en-US",
                              { month: "short", day: "2-digit" }
                            )
                          : ""}{" "}
                        | {item.eventTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text
                style={{ color: "#fff", textAlign: "center", marginTop: 40 }}
              >
                No events found.
              </Text>
            )}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontFamily: "Nunito Sans",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 24,
    color: "#C6C5ED",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#2d2d3a",
    width: "100%",
    marginBottom: dimensions.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: dimensions.spacing.md,
    marginBottom: 4,
    gap: 0,
  },
  tab: {
    flex: 1,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    shadowColor: "rgba(177, 92, 222, 0.15)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeTab: {
    flex: 1,
    borderWidth: 0,
  },
  inactiveTab: {
    flex: 1,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#34344A",
    backgroundColor: "#1A1A1F",
  },
  tabText: {
    color: "#C6C5ED",
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 21,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  title: {
    fontSize: dimensions.fontSize.large,
    fontWeight: "600",
    marginVertical: dimensions.spacing.lg,
  },
  listContainer: {
    paddingBottom: dimensions.spacing.md,
  },
  eventCard: {
    marginBottom: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: dimensions.imageHeight,
  },
  overlayRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    gap: 8,
  },
  overlayButton: {
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonFirst: {},
  overlayButtonText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 15,
    textTransform: "uppercase",
  },
  overlayPlus: {
    backgroundColor: "#a95eff",
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  },
  manageEventCardContainer: {
    width: '100%', // Full width for responsiveness
    maxWidth: 400, // Cap width for larger screens
    padding: dimensions.cardPadding,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(252, 252, 253, 0.12)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 6,
    marginBottom: dimensions.spacing.xxl,
    alignSelf: 'center', // Center the card
  },
  manageEventImageWrapper: {
    width: '100%',
    borderRadius: dimensions.borderRadius.md,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.md,
    position: 'relative',
  },
  manageEventImage: {
    width: '100%',
    height: Math.min(width * 0.6, 180), // Proportional height based on width
    borderRadius: dimensions.borderRadius.md,
  },
  manageEventDateBadge: {
    position: 'absolute',
    top: dimensions.spacing.sm,
    left: dimensions.spacing.sm,
    backgroundColor: '#181828',
    borderRadius: dimensions.borderRadius.sm,
    paddingHorizontal: dimensions.spacing.xs,
    paddingVertical: dimensions.spacing.xs,
    alignItems: 'center',
    zIndex: 2,
  },
  manageEventDateMonth: {
    color: '#fff',
    fontSize: Math.max(width * 0.03, 10),
    fontWeight: '600',
    lineHeight: 12,
  },
  manageEventDateDay: {
    color: '#fff',
    fontSize: Math.max(width * 0.05, 16),
    fontWeight: '700',
    lineHeight: 18,
  },
  manageEventTitle: {
    color: '#FCFCFD',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: Math.max(width * 0.045, 16), // Dynamic font size
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    marginTop: dimensions.spacing.xs,
    marginBottom: dimensions.spacing.sm,
    alignSelf: 'center',
    paddingRight: dimensions.spacing.lg, // Adjusted for better fit
  },
  manageEventButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: dimensions.spacing.sm,
    justifyContent: 'space-between', // Even spacing for buttons
  },
  manageEventButtonPurple: {
    flex: 1,
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: dimensions.spacing.sm,
    alignItems: 'center',
    marginRight: dimensions.spacing.sm,
    minHeight: dimensions.buttonHeight * 0.8,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  manageEventButtonTextWhite: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: Math.max(width * 0.035, 12), // Dynamic font size
    fontStyle: 'normal',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  manageEventTrashButton: {
    borderWidth: 1.2,
    borderColor: '#a95eff',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: dimensions.iconSize * 1.5,
    minHeight: dimensions.iconSize * 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: 393,
    height: 272,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    position: "relative",
    padding: 24,
    backgroundColor: "#8D6BFC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.4,
    shadowRadius: 34,
    elevation: 10,
    alignSelf: "center",
    maxWidth: "100%",
    marginHorizontal: 0,
  },
  modalCloseButton: {
    position: "absolute",
    backgroundColor: "#a95eff",
    borderRadius: dimensions.borderRadius.xl,
    width: Math.max(width * 0.1, 40),
    height: Math.max(width * 0.1, 40),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalButton: {
    width: "95%",
    paddingVertical: dimensions.spacing.lg,
    borderRadius: 14,
    alignItems: "center",
    marginTop: dimensions.spacing.lg,
    backgroundColor: "transparent",
    minHeight: dimensions.buttonHeight,
    justifyContent: "center",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  modalButtonWhite: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  modalButtonTextWhite: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 21,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  modalButtonTextPurple: {
    color: "#a95eff",
    fontSize: dimensions.fontSize.header,
    fontWeight: "600",
  },
  contractDetailsModalContent: {
    flex: 1,
    backgroundColor: "#111018",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contractDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: "#2d2d3a",
    minHeight: Math.max(height * 0.08, 60),
  },
  backButtonContainer: {
    minWidth: dimensions.iconSize,
    minHeight: dimensions.iconSize,
    justifyContent: "center",
    alignItems: "center",
  },
  contractDetailsHeaderTitle: {
    color: "#fff",
    fontFamily: "Nunito Sans",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "680",
    lineHeight: 24,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
    marginLeft: 12,
  },
  contractDetailsScrollViewContent: {
    paddingVertical: dimensions.spacing.xl,
  },
  contractDetailsSectionTitle: {
    color: "#C1C1C1",
    fontFamily: "Poppins",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 25,
    marginBottom: dimensions.spacing.sm,
    marginTop: dimensions.spacing.lg,
  },
  contractDetailsText: {
    color: "#838383",
    fontFamily: "Poppins",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 25,
    marginBottom: dimensions.spacing.md,
  },
  addToExistingModalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  addToExistingModalGradient: {
    flex: 1,
    borderTopLeftRadius: dimensions.borderRadius.xl,
    borderTopRightRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
    marginHorizontal: 0,
    paddingTop: Math.max(height * 0.08, 60),
    position: "relative",
    minHeight: Math.max(height * 0.5, 400),
  },
  addToExistingModalCloseButton: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: dimensions.borderRadius.xl,
    width: Math.max(width * 0.1, 40),
    height: Math.max(width * 0.1, 40),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  existingEventListContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  existingEventCard: {
    display: "flex",
    flexDirection: "row",
    height: 92,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 13,
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: "#F6F8FA",
    marginBottom: dimensions.spacing.md,
    overflow: "hidden",
    borderWidth: 0,
  },
  existingEventImage: {
    width: 78,
    height: 80,
    borderRadius: 4,
    marginRight: dimensions.spacing.md,
    backgroundColor: "#9A1E25",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4.8 },
    shadowOpacity: 0.1,
    shadowRadius: 28.8,
  },
  existingEventDetails: {
    flex: 1,
    padding: dimensions.spacing.md,
    justifyContent: "space-between",
  },
  existingEventTitle: {
    color: "#000",
    fontFamily: "Poppins",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: undefined,
    marginTop: 9,
    marginBottom: dimensions.spacing.xs,
  },
  existingEventDescription: {
    color: "#646465",
    fontFamily: "Inter",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 15,
    marginBottom: dimensions.spacing.sm,
  },
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: 393,
    height: 112,
    padding: 16,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#C6C5ED",
    shadowColor: "#683BFC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: "#121212",
    marginBottom: 0,
  },
});

export default ShortlistScreen;