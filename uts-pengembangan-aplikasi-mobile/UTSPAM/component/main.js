import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { warna } from "./warna";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";

export default function MainScreen({ navigation }) {
  const [text, settext] = useState("");
  const [masterData, setMasterData] = useState();
  const [filterData, setfilterData] = useState([]);
  const [search, setsearch] = useState("");

  // Mengambil Data
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contact = data;
          setMasterData(contact);
          setfilterData(contact);
        }
      }
    })();
  }, []);

  // Pilih Warna
  const pilihwarna = (id) => {
    let jml = 0;
    for (let i = 0; i < id.length; i++) {
      jml = jml + parseInt(id[i]);
    }
    let ubah = jml.toString();

    return warna[ubah[ubah.length - 1]];
  };

  // Fungsi Pencarian
  const cari = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterData(newData);
      setsearch(text);
    } else {
      setfilterData(masterData);
      setsearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Kontak</Text>
      </View>

      <TextInput
        style={styles.cari}
        value={search}
        onChangeText={(text) => {
          cari(text);
        }}
        placeholder={"Cari Diantara " + filterData.length + " Kontak"}
      />

      <FlatList
        data={filterData}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.boxList}
              onPress={() => {
                navigation.navigate("Detail", { item });
              }}
            >
              <View
                style={[
                  styles.tampilanHuruf,
                  { backgroundColor: pilihwarna(item.id) },
                ]}
              >
                <Text style={styles.hurufStyle}>
                  {item.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 15 }}> {item.name} </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.buttonPlus}
        onPress={() => {
          navigation.navigate("Tambah Kontak");
        }}
      >
        <AntDesign name="plus" size={30} color="blue" />
      </TouchableOpacity>

      <StatusBar backgroundColor="#FFF" barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: "grey",
  },
  header: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4682B4",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#454545",
  },
  cari: {
    backgroundColor: "#ADD8E6",
    marginHorizontal: 18,
    marginVertical: 15,
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  boxList: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    marginHorizontal: 15,
    marginVertical: 6,
    paddingLeft: 20,
  },
  tampilanHuruf: {
    fontSize: 18,
    borderRadius: 40,
    height: 50,
    width: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hurufStyle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
  },
  buttonPlus: {
    position: "absolute",
    top: 650,
    left: 260,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#ADD8E6",
  },
});
