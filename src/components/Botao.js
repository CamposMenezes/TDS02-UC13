import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/colors";

export default function Botao ({label, onPress, disabled = false}) {
    return (

        <Pressable
            onPress={onPress}
            disable={disabled}
            style={({pressed}) =>[
                styles.button,
                pressed && styles.buttonPressed,
                disabled && styles.buttonDisabled
            ]}
        >
            <Text style={styles.label}>{label}</Text>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        minHeight: 52,
        backgroundColor: colors.primary,
        borderRadius: 14, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    buttonPressed: {
        opacity: 0.82,
    },
    buttonDisabled : {
        opacity: 0.45,
    },
    label : {
        color: colors.surface,
        fontSize:16,
        fontWeight: '700',
    }
})