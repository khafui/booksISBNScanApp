import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ListRenderItem,
  useColorScheme,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getBookISBN } from '../api/books';
import * as book1 from '../api/book1.json';
import * as book2 from '../api/book2.json';
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { FIRESTORE_DB } from '../config/FirebaseConfig';
import { Stack, useRouter } from 'expo-router';
import { router } from 'expo-router';

const list = () => {
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [books, setBooks] = useState<any>([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    const code = data;
    const bookData = await getBookISBN(code);
    console.log('book info', bookData);
    setShowScanner(false);
    if (!bookData.items) return;
    addBook(bookData.items[0]);
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    const booksCollection = collection(FIRESTORE_DB, 'users', 'simon', 'books');

    onSnapshot(booksCollection, (snapshot) => {
      const books = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setBooks(books);
    });
    // console.log('first', books);
  }, []);

  const addBook = async (book: any) => {
    const result = book1.items[0];
    const newBook = {
      bookId: book.id,
      volumeInfo: book.volumeInfo,
      webReaderLink: book.accessInfo?.webReaderLink,
      textSnippet: book.searchInfo?.textSnippet,
      favorite: false,
      created: serverTimestamp(),
    };
    const db = await addDoc(
      collection(FIRESTORE_DB, 'users', 'simon', 'books'),
      newBook
    );
  };

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => router.push(`/(book)/${item.id}`)}>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            marginBottom: 20,
            backgroundColor: '#f6f6f6',
            padding: 10,
            elevation: 0.5,
            borderRadius: 5,
          }}
        >
          <Image
            source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
            style={{ width: 50, height: 50 }}
          />
          <View>
            <Text>{item.volumeInfo.title}</Text>
            <Text>{item.volumeInfo.authors[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowScanner(false)}>
              {showScanner ? (
                <Text
                  style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
                >
                  Close
                </Text>
              ) : (
                <></>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      {/* {showScanner ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )} */}
      {showScanner && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{
            ...StyleSheet.absoluteFillObject,
            // width: '100%',
            // height: '100%',
            elevation: 2,
            zIndex: 2,
          }}
        />
      )}

      <View style={{ padding: 20 }}>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      {hasPermission && (
        //setShowScanner(true)
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowScanner(!showScanner)}
        >
          {!showScanner ? (
            <Text style={styles.fabIcon}>+</Text>
          ) : (
            <Text style={styles.fabIcon}>x</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f5fcff',
    // padding: 20,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03a9f4',
    borderRadius: 30,
    elevation: 8,
    zIndex: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default list;
