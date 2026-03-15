import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

export default function SocialScreen({
  posts = [],
  scrollY,
  headerHeight = 0,
  onOpenProfile,
}) {

  const CURRENT_USER_ID = "user1";
  const CURRENT_USER_NAME = "Farmer";

  const [feed, setFeed] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  const [menuPost, setMenuPost] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyIndex, setReplyIndex] = useState(null);

  useEffect(() => {
    const safe = posts
      .filter((p) => !deletedIds.includes(p.id))
      .map((p) => ({
        ...p,
        likes: p.likes || 0,
        likedUsers: p.likedUsers || [],
        comments: (p.comments || []).map((c) => ({
          ...c,
          likes: c.likes || 0,
          likedUsers: c.likedUsers || [],
          replies: (c.replies || []).map((r) => ({
            ...r,
            likes: r.likes || 0,
            likedUsers: r.likedUsers || [],
          })),
        })),
      }));

    setFeed(safe);
  }, [posts, deletedIds]);

  const activePost = feed.find((p) => p.id === activePostId);

  /* LIKE POST */
  const toggleLikePost = (postId) => {
    setFeed((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likedUsers.includes(CURRENT_USER_ID);
        return {
          ...p,
          likes: liked ? p.likes - 1 : p.likes + 1,
          likedUsers: liked
            ? p.likedUsers.filter((id) => id !== CURRENT_USER_ID)
            : [...p.likedUsers, CURRENT_USER_ID],
        };
      })
    );
  };

  /* DELETE POST */
  const deletePost = () => {
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          setDeletedIds((prev) => [...prev, menuPost.id]);
          setMenuPost(null);
        },
      },
    ]);
  };

  /* OPEN COMMENTS */
  const openComments = (post) => {
    setActivePostId(post.id);
    setCommentModal(true);
  };

  /* ADD COMMENT */
  const addComment = () => {
    if (!commentText.trim()) return;

    setFeed((prev) =>
      prev.map((p) =>
        p.id === activePostId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  userName: CURRENT_USER_NAME,
                  text: commentText,
                  likes: 0,
                  likedUsers: [],
                  replies: [],
                },
              ],
            }
          : p
      )
    );

    setCommentText("");
  };

  /* LIKE COMMENT */
  const toggleLikeComment = (index) => {
    setFeed((prev) =>
      prev.map((p) => {
        if (p.id !== activePostId) return p;

        const c = p.comments[index];
        const liked = c.likedUsers.includes(CURRENT_USER_ID);

        const newComments = [...p.comments];
        newComments[index] = {
          ...c,
          likes: liked ? c.likes - 1 : c.likes + 1,
          likedUsers: liked
            ? c.likedUsers.filter((id) => id !== CURRENT_USER_ID)
            : [...c.likedUsers, CURRENT_USER_ID],
        };

        return { ...p, comments: newComments };
      })
    );
  };

  /* ADD REPLY */
  const addReply = (cIndex) => {
    if (!replyText.trim()) return;

    setFeed((prev) =>
      prev.map((p) => {
        if (p.id !== activePostId) return p;

        const newComments = [...p.comments];
        newComments[cIndex].replies.push({
          userName: CURRENT_USER_NAME,
          text: replyText,
          likes: 0,
          likedUsers: [],
        });

        return { ...p, comments: newComments };
      })
    );

    setReplyText("");
    setReplyIndex(null);
  };

  /* LIKE REPLY */
  const toggleLikeReply = (cIndex, rIndex) => {
    setFeed((prev) =>
      prev.map((p) => {
        if (p.id !== activePostId) return p;

        const newComments = [...p.comments];
        const reply = newComments[cIndex].replies[rIndex];
        const liked = reply.likedUsers.includes(CURRENT_USER_ID);

        newComments[cIndex].replies[rIndex] = {
          ...reply,
          likes: liked ? reply.likes - 1 : reply.likes + 1,
          likedUsers: liked
            ? reply.likedUsers.filter((id) => id !== CURRENT_USER_ID)
            : [...reply.likedUsers, CURRENT_USER_ID],
        };

        return { ...p, comments: newComments };
      })
    );
  };

  const renderItem = ({ item }) => {
    const liked = item.likedUsers.includes(CURRENT_USER_ID);

    return (
      <View style={styles.card}>
        <View style={styles.userRow}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => onOpenProfile(item.user)}
          >
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.user.name}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuPost(item)}>
            <Text style={styles.menu}>⋮</Text>
          </TouchableOpacity>
        </View>

        <Image source={{ uri: item.image }} style={styles.postImage} />

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => toggleLikePost(item.id)}>
            <Text style={[styles.action, { color: liked ? "red" : "#333" }]}>
              ❤️ {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openComments(item)}>
            <Text style={styles.action}>💬 {item.comments.length}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.crop}>🌾 {item.crop}</Text>
      </View>
    );
  };

  return (
    <>
      <Animated.FlatList
        data={feed}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: 120,
        }}
      />

      {/* COMMENT MODAL */}
      <Modal visible={commentModal} animationType="slide">
        <View style={{ flex: 1, padding: 15 }}>
          <ScrollView>
            {activePost?.comments.map((c, i) => {
              const liked = c.likedUsers.includes(CURRENT_USER_ID);
              return (
                <View key={i} style={styles.commentBox}>
                  <View style={styles.commentRow}>
                    <Text>
                      <Text style={{ fontWeight: "700" }}>
                        {c.userName}{" "}
                      </Text>
                      {c.text}
                    </Text>
                    <TouchableOpacity onPress={() => toggleLikeComment(i)}>
                      <Text style={{ color: liked ? "red" : "#FF7A00" }}>
                        ❤️ {c.likes}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {c.replies.map((r, ri) => {
                    const rLiked = r.likedUsers.includes(CURRENT_USER_ID);
                    return (
                      <View key={ri} style={styles.replyRow}>
                        <Text>
                          <Text style={{ fontWeight: "700" }}>
                            {r.userName}{" "}
                          </Text>
                          {r.text}
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleLikeReply(i, ri)}
                        >
                          <Text style={{ color: rLiked ? "red" : "#FF7A00" }}>
                            ❤️ {r.likes}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                  <TouchableOpacity onPress={() => setReplyIndex(i)}>
                    <Text style={styles.replyBtn}>Reply</Text>
                  </TouchableOpacity>

                  {replyIndex === i && (
                    <View style={styles.inputRow}>
                      <TextInput
                        value={replyText}
                        onChangeText={setReplyText}
                        placeholder="Reply..."
                        style={styles.input}
                      />
                      <TouchableOpacity onPress={() => addReply(i)}>
                        <Text style={styles.send}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write comment..."
              style={styles.input}
            />
            <TouchableOpacity onPress={addComment}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.close}
            onPress={() => setCommentModal(false)}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* MENU */}
      <Modal visible={!!menuPost} transparent animationType="fade">
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuPost(null)}
        >
          <View style={styles.menuBox}>
            {menuPost?.user?.id === CURRENT_USER_ID && (
              <TouchableOpacity style={styles.menuItemRow} onPress={deletePost}>
                <Text style={styles.deleteText}>🗑 Delete Post</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => {
                Alert.alert("Reported");
                setMenuPost(null);
              }}
            >
              <Text style={styles.menuText}>🚩 Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => setMenuPost(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card:{backgroundColor:"#fff",margin:10,borderRadius:14,elevation:3,overflow:"hidden"},
  userRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:12},
  avatar:{width:40,height:40,borderRadius:20,marginRight:10},
  name:{fontWeight:"700"},
  location:{fontSize:12,color:"#777"},
  menu:{fontSize:22},
  postImage:{width:"100%",height:250},
  actionRow:{flexDirection:"row",padding:12},
  action:{marginRight:25,fontWeight:"600"},
  caption:{paddingHorizontal:12},
  crop:{paddingHorizontal:12,paddingBottom:12,color:"#777"},
  commentBox:{paddingVertical:8,borderBottomWidth:1,borderColor:"#eee"},
  commentRow:{flexDirection:"row",justifyContent:"space-between"},
  replyRow:{flexDirection:"row",justifyContent:"space-between",marginLeft:20},
  replyBtn:{color:"#FF7A00",marginTop:4},
  inputRow:{flexDirection:"row",alignItems:"center",marginTop:10},
  input:{flex:1,borderWidth:1,borderColor:"#ddd",borderRadius:10,padding:10,marginRight:10},
  send:{color:"#FF7A00",fontWeight:"700"},
  close:{marginTop:15,backgroundColor:"#FF7A00",padding:12,borderRadius:10,alignItems:"center"},
  menuOverlay:{flex:1,backgroundColor:"rgba(0,0,0,0.3)",justifyContent:"flex-end"},
  menuBox:{backgroundColor:"#fff",padding:20,borderTopLeftRadius:20,borderTopRightRadius:20},
  menuItemRow:{paddingVertical:14},
  menuText:{fontSize:16},
  deleteText:{fontSize:16,color:"red",fontWeight:"700"},
  cancelText:{fontSize:16,color:"red",fontWeight:"700"},
});