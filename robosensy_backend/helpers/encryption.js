import bcrypt from "bcryptjs";

export default class encrytion {
  constructor() {}

  encryptData = (data) => {
    try {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(data, salt);
      return hash;
    } catch (error) {
      console.log(error);
    }
  };

  compareData = async (plainData, hashedData) => {
    try {
      const result = bcrypt.compare(plainData, hashedData);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  decryptData = async (encryptedData) => {
    // Decryption function, e.g. AES
    const decryptedData = await bcrypt.decryptData(encryptedData);
    return decryptedData;
  };
}
