import {useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {


  // const getData = async ()=> {

  // const values = await AsyncStorage.multiGet()


  // }

  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const asyncTaskItems = [];
  const getData = async ()=> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const items = await AsyncStorage.multiGet(keys)

      items.forEach(item => {

        // console.log(item[1])
        asyncTaskItems.push(JSON.parse(item[1]))
        
      });
      setTaskItems(asyncTaskItems)
      
      // console.log(asyncTaskItems)
      // let asyncTaskItems2 = taskItems.concat(asyncTaskItems)

      // console.log(asyncTaskItems2)

  } catch (error) {
      console.log(error, "problemo")
  }
  }

  // setTaskItems(asyncTaskItems)


  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    // clear error
  }

  console.log('Done.')
}

  const handleAddTask = ()=> {
    Keyboard.dismiss()
    // console.log(task)
    setTaskItems([...taskItems, task]);
    let curr_key = '@'+makeid(3)
    const saveData =  async ()=>{

      try {
        await AsyncStorage.setItem(curr_key, JSON.stringify(task));
        console.log('saved!')
      } catch (error) {
        console.log(error)
        // Error saving data
      }

    }
    saveData()

    setTask(null)


    // console.log(getData())
    getData();
  }


  getData();

  const deleteData = async (val)=>{

    const keys = await AsyncStorage.getAllKeys()
    const items = await AsyncStorage.multiGet(keys)

    items.forEach(item => {

    if(JSON.parse(item[1]) == val){
      AsyncStorage.removeItem(item[0]);
      console.log("right one")
    }else{
      console.log("no it")
    }
      
    });
  }

  const completeTask = (index)=> {

    let itemCopy = [...taskItems]
    // itemCopy.splice(index, 1)
    // setTaskItems(itemCopy)
    // console.log(itemCopy[index])
    let val = itemCopy[index];
    deleteData(val)
    getData();

  }

  return (
    <View style={styles.container}>
      
        {/* today's task part */}

        <View style={styles.tasksWrapper} >
            <Text style={styles.sectionTitle} >Today's tasks</Text>

            <View style={styles.items} >

              {
                taskItems.map((item, index)=>{
                  return (

                    <TouchableOpacity key={index} onPress={()=>completeTask(index)} >
                      <Task  text={item} />
                    </TouchableOpacity>

                  )
                })
              }
                {/* <Task text={'task 1'} />
                <Task text={'task 2'} /> */}
            
            </View>

        </View>
        

            {/* write new task */}

            <KeyboardAvoidingView
                behavior={Platform.OS  === 'android'? 'height':'padding'}
                style={styles.writeTaskWrapper}
            >
              <TextInput style={styles.input} placeholder="Write a task" value={task} onChangeText={text => setTask(text)} />

              <TouchableOpacity onPress={()=>handleAddTask()} >

                <View style={styles.addWrapper} >

                    <Text style={styles.addText} >+</Text>

                </View>

              </TouchableOpacity>

            </KeyboardAvoidingView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#E8EAED',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  tasksWrapper: {
    paddingTop:80,
    paddingHorizontal:20,
  },
  sectionTitle :{
    fontSize:24,
    fontWeight:"bold"
  },
  items :{
    marginTop:30,
  },
  writeTaskWrapper:{
    position:'absolute',
    bottom:60,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'

  },
  input:{
    paddingHorizontal:15,
    paddingVertical:15,
    width:250,
    borderColor:"#C0C0C0",
    borderWidth:1,
    borderRadius:60,
    backgroundColor:'#FFF',
  },

  addWrapper:{
    width:60,
    height:60,
    borderColor:"#C0C0C0",
    borderWidth:1,
    borderRadius:60,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFF',


  }
});
