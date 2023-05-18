export const getDistanceFromLatLonInKm = (latitude1, longitude1, latitude2, longitude2) => {
  var R = 6371; // bán kính trái đất (đơn vị: km)
  var dLat = deg2rad(latitude2 - latitude1);
  var dLon = deg2rad(longitude2 - longitude1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + //Vĩ độ lệch giữa 2 điểm
    Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // phạm vi (đơn vị: km)
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
