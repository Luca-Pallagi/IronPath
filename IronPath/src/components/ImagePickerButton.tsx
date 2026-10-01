import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { copyImageToAppDirectory } from '@/utils/imageStorage';

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

export default function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {
  const handleResult = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || result.assets.length === 0) return;

    try {
      const permanentUri = await copyImageToAppDirectory(result.assets[0].uri);
      onImageSelected(permanentUri);
    } catch (error) {
      console.error('Fehler beim Speichern des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht gespeichert werden.');
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Fehler', 'Kamera-Zugriff benötigt!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    await handleResult(result);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Fehler', 'Zugriff auf die Galerie benötigt!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    await handleResult(result);
  };

  const handlePress = () => {
    if (Platform.OS === 'web') {
      openGallery();
      return;
    }

    Alert.alert('Bild auswählen', 'Wie möchten Sie das Bild hinzufügen?', [
      { text: 'Foto aufnehmen', onPress: openCamera },
      { text: 'Aus Galerie wählen', onPress: openGallery },
      { text: 'Abbrechen', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.frame}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={32} color="#f5a623" />
            <Text style={styles.placeholderText}>Bild hinzufügen</Text>
          </View>
        )}
      </View>

      <View style={styles.badge}>
        <Ionicons name={imageUri ? 'pencil' : 'add'} size={16} color="#0d1216" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 132,
    height: 132,
    alignSelf: 'center',
    marginTop: 8,
  },
  frame: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#f5a623',
    backgroundColor: '#151c22',

    // Glow
    shadowColor: '#f5a623',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  placeholderText: {
    fontSize: 13,
    color: '#9aa5ad',
    textAlign: 'center',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5a623',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0d1216',
  },
});