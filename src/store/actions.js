export default {
    saveUser(context, username, displayName){
        context.commit("saveUser", username, displayName)
    },
    saveUserType(context, isAdmin){
        context.commit("saveUserType", isAdmin)
    }
}
