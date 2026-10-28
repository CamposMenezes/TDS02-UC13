import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/colors";

export default function Input({
    label,
    value, 
    placeHolder,
    onChangeText,
    secureTextEntry = false,
    keyBoardType = 'default',
    multiline = false,
}) {

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeHolder}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={secureTextEntry}
                keyboardType={keyBoardType}
                multiline={multiline}
                style={[styles.input, multiline && styles.inputMultiline]}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    wrapper: {
        gap: 7,
    },
    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    input : {
        minHeight: 50,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius:13,
        paddingHorizontal: 14,
        color: colors.text,
        fontSize: 15,
    },
    inputMultiline : {
        minHeight: 100,
        paddingTop: 14,
        textAlignVertical: 'top',
    },
});