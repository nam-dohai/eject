import axios from 'axios';
const GOONG = {
  API_KEY: '7Yt40HDZSQ02FY5bNajCiZ9x0b1kKnRSxb2ujuDx',
  END_POINTS: {
    AUTO_COMPLETE: 'https://rsapi.goong.io/Place/AutoComplete?',
    PLACE: 'https://rsapi.goong.io/Place/Detail?',
    DISTANCE: 'https://rsapi.goong.io/DistanceMatrix?',
  },
};

export const getLocations = (input) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${GOONG.END_POINTS.AUTO_COMPLETE}api_key=${GOONG.API_KEY}&input=${input}`
      )
      .then((res) => {
        resolve(res.data.predictions);
      })
      .catch((error) => alert(error));
  })
};

export const getCoordinate = (place_id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${GOONG.END_POINTS.PLACE}api_key=${GOONG.API_KEY}&place_id=${place_id}`
      )
      .then((res) => {
        const lat = res.data.result.geometry.location.lat;
        const lng = res.data.result.geometry.location.lng;
        const coordinate = `${lat},${lng}`;
        resolve(coordinate);
      })
      .catch((error) => alert(error));

  })
}

export const getDistance = (origin, destination) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${GOONG.END_POINTS.DISTANCE}api_key=${GOONG.API_KEY}&origins=${origin}&destinations=${destination}&vehicle=bike`
      )
      .then((res) => {
        const distance = res.data.rows[0].elements[0].distance.text;
        resolve(distance);
      })
      .catch((error) => alert(error));
  })
}
