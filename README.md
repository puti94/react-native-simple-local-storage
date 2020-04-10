# react-native-sync-local-storage

@react-native-community/async-storage 组件的同步写法

## 原理
一开始就将保存的数据全部导入内存中，初始化完毕后就可以直接在内存操作，速度更快

### Install

```
$ yarn add react-native-sync-local-storage
```

### Simple use
```jsx
 //在入口文件中;
 import 'react-native-sync-local-storage';
 function App(){
   const [isReady, setReady] = useState(false);
   useEffect(() => {
     global.localStorage.isReady.then(() => setReady(true));
    }, []);
   if (!isReady) {
     return null;
   }
   return (<View>
            <Button onPress={() => global.localStorage.setItem('key', 'value')}>setItem</Button>
            <Button onPress={() => console.log(localStorage.getItem('key'))}>getItem</Button>
            <Button onPress={() => localStorage.removeItem('key')}>removeItem</Button>
            <Button onPress={() => localStorage.clear()}>clear</Button>
            <Button onPress={() => console.log(global.localStorage.length)}>length</Button>
            <Button onPress={() => console.log(global.localStorage.byteSize)}>byteSize</Button>
   </Layout>);
 }
```
