/**
 * User: puti.
 * Time: 2020-04-10 15:25.
 */
import AsyncStorage from '@react-native-community/async-storage';
declare var global: NodeJS.Global;
declare global {
  const localStorage: Storage;
  namespace NodeJS {
    interface Global {
      localStorage: Storage;
    }
  }
}

function assert(val: boolean, msg: string) {
  if (!val) {
    throw new Error(msg || 'Assertion failed');
  }
}

function assertKey(key: any) {
  assert(typeof key === 'string', 'key is should be string key');
}

function assertValue(value: any) {
  assert(typeof value === 'string', 'value is should be string value');
}

function handleError(e: Error) {
  console.warn('localStorage:Error', e);
}

/**
 * 获取字符串字节大小
 * @param str
 * @returns {number}
 */
function getBytesLength(str: string) {
  let totalLength = 0;
  let charCode;
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength++;
    } else if (charCode >= 0x0080 && charCode <= 0x07ff) {
      totalLength += 2;
    } else if (charCode >= 0x0800 && charCode <= 0xffff) {
      totalLength += 3;
    } else {
      totalLength += 4;
    }
  }
  return totalLength;
}

export class Storage {
  private dataMap = new Map<string, string | null>();
  public isReady: Promise<boolean> = new Promise<boolean>(async (resolve) => {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    data.forEach(this.saveItem);
    resolve(true);
  });

  get length(): number {
    return this.dataMap.size;
  }

  getItem = (key: string): string | null => {
    assertKey(key);
    return this.dataMap.get(key) || null;
  };

  clear = (): void => {
    this.dataMap.clear();
    AsyncStorage.clear().catch(handleError);
  };

  get byteSize(): number {
    const obj: {[key: string]: string | null} = {};
    for (let [k, v] of this.dataMap) {
      obj[k] = v;
    }
    return getBytesLength(JSON.stringify(obj));
  }

  setItem = (key: string, value: string): void => {
    assertKey(key);
    assertValue(value);
    this.dataMap.set(key, value);
    AsyncStorage.setItem(key, value).catch(handleError);
  };

  removeItem = (key: string): void => {
    assertKey(key);
    this.dataMap.delete(key);
    AsyncStorage.removeItem(key).catch(handleError);
  };

  private saveItem = (item: [string, string | null]) => {
    this.dataMap.set(item[0], item[1]);
  };
}

const localStorage = new Storage();
global.localStorage = localStorage;
export default localStorage;
