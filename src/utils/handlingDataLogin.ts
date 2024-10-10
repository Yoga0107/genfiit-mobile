import AsyncStorage from "@react-native-async-storage/async-storage";

const saveToken = async (value:string) => {
    try {
      await AsyncStorage.setItem('token', value);
    } catch (e) {
      alert(`Saving data failed: ${e}`)
    }
};

// const saveToken = async (token: string, name: string) => {
//   if (!token || !name) {
//     alert('Token atau name tidak valid');
//     return;
//   }

//   try {
//     await AsyncStorage.multiSet([['token', token], ['name', name]]);
//     console.log('Token dan name tersimpan:', token, name);
//   } catch (e) {
//     alert(`Saving data failed: ${e}`);
//   }
// };



const deleteToken = async () => {
    try {
      await AsyncStorage.multiRemove(['token','name'])
    } catch(e) {
        alert(`Remove data failed: ${e}`)
    }
};

// const deleteToken = async () => {
//     try {
//       await AsyncStorage.removeItem('token')
//     } catch(e) {
//         alert(`Remove data failed: ${e}`)
//     }
// };

const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token
    } catch (e) {
        alert(`Getting data failed: ${e}`)
    }
}

const getName = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      return name
    } catch (e) {
        alert(`Getting data failed: ${e}`)
    }
}

export {
    saveToken, deleteToken, getToken, getName
}