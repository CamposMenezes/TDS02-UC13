import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export default function Card ({value,label}) {
    return (
        <View style={styles.card}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        flex: 1,
        minHeight: 92,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent:'center',
    },
    value: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '800',
    },
    label: {
        marginTop: 4,
        color:colors.textMuted,
        fontSize:13,
    }
})