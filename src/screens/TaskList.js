import react, { Component } from "react"
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from "react-native"

import commonStyles from "../commonStyles"
import todayImage from "../../assets/imgs/today.jpg"

import moment from 'moment'
import 'moment/locale/pt-br'

import AsyncStorage from "@react-native-async-storage/async-storage"

import Task from "../components/Task"
import { Ionicons } from "@expo/vector-icons"
import AddTask from "./addTask"

const initialState = {
    showDoneTask: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}


export default class TaskList extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const state = JSON.parse(stateString) || initialState
        this.setState(state, this.filterTask)

        this.filterTask()
    }

    toggleFilter = () => {
        this.setState({ showDoneTask: !this.state.showDoneTask }, this.filterTask)
    }

    addTask = newTask => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        const tasks = [...this.state.tasks]

        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            stimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTask)
    }

    deleteTask = (id) => {
        const tasks = this.state.tasks.filter(task => task.id != id)
        this.setState({ tasks }, this.filterTask)
    }

    filterTask = () => {
        let visibleTasks = null
        if (this.state.showDoneTask) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

    toggleTask = id => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if (task.id === id) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({ tasks }, this.filterTask)
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <AddTask
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })}
                    isVisible={this.state.showAddTask}
                />
                <ImageBackground
                    style={styles.background}
                    source={todayImage}
                >
                    <View style={styles.IconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Ionicons name={this.state.showDoneTask ? "eye" : "eye-off"} size={25} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>

                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) => <Task {...item} toggleTask={this.toggleTask} onDelete={this.deleteTask}></Task>}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => this.setState({ showAddTask: true })}
                    activeOpacity={0.5}
                    style={styles.addButton}>
                    <Ionicons
                        name="add-sharp"
                        size={20}
                        color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    IconBar: {
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 20,
        justifyContent: 'flex-end'
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})