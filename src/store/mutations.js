export default {
    saveUser(state, username, displayName){
        state.username = username
        state.display_name = displayName === "" ? displayName : username
    },
    saveUserType(state, isAdmin){
        state.is_staff = isAdmin
    }
}
