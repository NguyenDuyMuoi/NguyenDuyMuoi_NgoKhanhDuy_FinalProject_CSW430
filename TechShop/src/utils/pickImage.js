import { launchImageLibrary } from "react-native-image-picker";

export const pickImage = async () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          reject(response.errorMessage);
        } else {
          const asset = response.assets[0];
          resolve(asset);
        }
      }
    );
  });
};
