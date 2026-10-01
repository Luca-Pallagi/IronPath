import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Bild hinzufügen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
});