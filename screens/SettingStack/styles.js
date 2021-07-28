import { StyleSheet, Dimensions } from "react-native";
import { PRIMARY_COLOR } from "../../assets/styles";

export default styles = StyleSheet.create({
  selection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    borderWidth: 1,
  },
  selectionText: {
    fontSize: 16,
    paddingHorizontal: 16,
  },
  selectionChecked: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderColor: '#FDA085',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(253, 160, 133,0.1)',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 16,
    paddingLeft: 16,
    marginTop: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  selected: {
    backgroundColor: 'rgba(253, 160, 133,0.1)',
  },
  result: {
    paddingVertical: 16,
    borderRadius: 4,
  }

})