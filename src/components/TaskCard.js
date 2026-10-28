import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export default function TaskCard({
    task,
    onPress,
    onToggleDone
}) {
    return (

        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >

            {/* Linha superior do card */}
            <View style={styles.topRow}>
                <Text
                    style={styles.category}>{task.category}

                </Text>
                <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>{task.priority}</Text>
                </View>

            </View>

            {/* Titulo */}

            <Text style={[
                styles.title,
                task.done && styles.titleDone
            ]}>
                {task.title}
            </Text>

            {/* Descrição */}
            <Text
                style={styles.description}
                numberOfLines={2}
            >
                {task.description}
            </Text>

            {/* area de status 
                -checkbox;
                - texto de pendente ou cocluido            
            */}

            <View style={styles.statusRow}>
                <Pressable

                    //Quando o usuario tocar no checkbox
                    // chamamos a função recebida pela props
                    onPress={() => onToggleDone(task)}

                    style={[
                        styles.checkbox,
                        task.done && styles.checkboxChecked
                    ]}
                >

                    {task.done ? (
                        <Text style={styles.checkmark}>
                            ✔️
                        </Text>
                    ) : null}
                </Pressable>

                {/* texto de status */}

                <Text
                    style={
                        task.done
                            ? styles.doneText
                            : styles.pendingText
                    }
                >
                    {task.done ? 'Concluída' : 'Pendente'}

                </Text>
            </View>

        </Pressable>

    )
}

const styles = StyleSheet.create({
    card :{
        backgroundColor: colors.surface,
        borderRadius: 16, 
        borderWidth: 1,
        borderColor: colors.border,
        padding:16,
        gap: 8,
    },
    
    cardPressed : {
        opacity: 0.75,
    },

    topRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    category: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },
    priorityBadge : {
        backgroundColor: colors.secondary,
        borderRadius: 999,
        paddingHorizontal:10,
        paddingVertical: 5,
    },
    priorityText :{
        color: colors.primaryDark,
        fontSize: 11,
        fontWeight: '700',
    }, 
    title :{
        color: colors.text,
        fontSize: 17,
        fontWeight: '800',
    },
    titleDone :{
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    description :{
        color: colors.textMuted,
        lineHeight: 20,
    },

    // Linha do status

    statusRow : {
        flexDirection: 'row',
        alignItems:'center',
        gap: 8,
        marginTop:4,
    },

    checkbox :{
        width: 22,
        height: 22,
        borderWidth:2,
        borderColor: colors.border,

        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    checkboxChecked : {
        backgroundColor: colors.sucess,
        borderColor: colors.sucess,
    },

    checkmark :{
        color: colors.surface,
        fontSize: 14,
        fontWeight:'900',
    },

    pendingText: {
        color: colors.warning,
        fontSize: 12, 
        fontWeight: '700',
    },
    doneText: {
        color: colors.sucess,
        fontSize: 12, 
        fontWeight: '700',
    },

})