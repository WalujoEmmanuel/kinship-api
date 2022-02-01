module.exports = {
  
  ShowDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  },

  ShowTime() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    return time;
  }

}