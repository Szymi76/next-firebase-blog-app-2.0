import { storage } from "./firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

/**
 * Przesyła wszystkie zdjęcia z dwu-wymiarowej tablicy do firebase
 * storage i zwraca dwy-wymiarową tablicę z linkami.
 * @param name prefiks do każdej nazwy zdjęcia.
 * @param images tablica plików.
 * @returns tablice linkow do firebase storage.
 */
const uploadContentImages = async (name: string, images: any[]) => {
  return await Promise.all(
    images.map(async (file, i) => {
      return typeof file == "string" ? file : await uploadFile(file, `${name}__${i}`);
    })
  );
};

/**
 * Przesyła zdjęcie do firebase storage i zwraca link do tego zdjęcia
 * @param file plik / zdjęcie.
 * @param fileName nowa nazwa pliku.
 * @returns link do pliku.
 */
const uploadFile = async (file: any, fileName: string) => {
  if (!file) return null;
  if (typeof file == "string") return file;
  const imageRef = ref(storage, fileName);
  const upload = await uploadBytes(imageRef, file);
  return await getDownloadURL(upload.ref);
};

export { uploadContentImages, uploadFile };
