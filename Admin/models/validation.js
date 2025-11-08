import { Get_Element_ID } from "../controllers/index.js";

class Validation {
    checkEmpty(value, errorID, mess) {
        if (value === "") {
            Get_Element_ID(errorID).style.display = "block";
            Get_Element_ID(errorID).innerHTML = mess;
            return false;
        }
        Get_Element_ID(errorID).style.display = "none";
        Get_Element_ID(errorID).innerHTML = "";
        return true;
    }
    checkDuplicateID(value, array, errorID, mess) {
        const isExist = array.some((item) => item.id === value);
        if (isExist) {
            Get_Element_ID(errorID).style.display = "block";
            Get_Element_ID(errorID).innerHTML = mess;
            return false;
        }
        Get_Element_ID(errorID).style.display = "none";
        Get_Element_ID(errorID).innerHTML = "";
        return true;
    }
    checkOption(idSelect, errorID, mess) {
    const optionIndex = Get_Element_ID(idSelect).selectedIndex;
    if (optionIndex === 0) {
      Get_Element_ID(errorID).style.display = "block";
      Get_Element_ID(errorID).innerHTML = mess;
      return false;
    }
    Get_Element_ID(errorID).style.display = "none";
    Get_Element_ID(errorID).innerHTML = "";
    return true;
  }

  checkURL(value, errorID, mess) {
    const pattern =
      /^(https?:\/\/)([a-zA-Z0-9.-]+)(\/[^\s]*)?\.(jpg|jpeg|png|gif|webp)$/i;
    if (!pattern.test(value)) {
      Get_Element_ID(errorID).style.display = "block";
      Get_Element_ID(errorID).innerHTML = mess;
      return false;
    }
    Get_Element_ID(errorID).style.display = "none";
    Get_Element_ID(errorID).innerHTML = "";
    return true;
  }
}

export default Validation