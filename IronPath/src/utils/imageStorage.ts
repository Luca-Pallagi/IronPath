import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

export async function copyImageToAppDirectory(sourceUri: string): Promise<string> {
  // Im Browser gibt es kein permanentes Dateisystem
  if (Platform.OS === 'web') {
    return sourceUri;
  }

  if (!FileSystem.documentDirectory) {
    throw new Error('documentDirectory ist nicht verfügbar.');
  }

  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    const fileName = `${Date.now()}.jpg`;
    const destinationUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.copyAsync({
      from: manipulated.uri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error('copyImageToAppDirectory fehlgeschlagen:', error);
    throw error;
  }
}

export async function deleteImageFile(uri?: string): Promise<void> {
  if (!uri || Platform.OS === 'web') return;

  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch (error) {
    console.error('Fehler beim Löschen der Bild-Datei:', error);
  }
}
// Das ImageStoreage wurde mit der KI generiert