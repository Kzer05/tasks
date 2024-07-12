import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import commonStyles from "../commonStyles"


import moment from 'moment'
import 'moment/locale/pt-br'
import { ListItem } from "@rneui/themed"

export default props => {
    const doneOrNotStyle = props.doneAt != null ?
        { textDecorationLine: 'line-through' } : {}

    const date = props.doneAt || props.stimateAt
    const formattedDate = moment(date).locale('pt-br')
        .format('ddd, D [de] MMMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Ionicons name="trash" size={30} color={"#FFF"} />
            </TouchableOpacity>
        )
    }



    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Ionicons name="trash" size={20} color={"#FFF"} style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <ListItem.Swipeable
            bottomDivider
            /* leftWidth={Dimensions.get('window').width/2} */
            /*onSwipeBegin={(direction) => direction == 'left' && props.onDelete && props.onDelete(props.id)}*/
            rightWidth={90}
            minSlideWidth={40}
            rightContent={getRightContent}
            /* leftContent={getLeftContent} */
            Component={() => (<View style={styles.container}>

                <TouchableWithoutFeedback
                    onPress={() => props.toggleTask(props.id)}
                >
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.conta}>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>)}
        >


        </ListItem.Swipeable>
    )
}

function getCheckView(doneAt) {
    if (doneAt !== null) {

        return (
            <View style={styles.done}>
                <Ionicons name="checkmark-circle" size={32} color="green" />
            </View>
        )
    } else {
        return (
            <View style={styles.pending}></View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff',
        zIndex: 1
    },
    checkContainer: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '555'
    },
    done: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12
    },
    right: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeIcon: {
        marginLeft: 10
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }
})