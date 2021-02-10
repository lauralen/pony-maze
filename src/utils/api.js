export const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

export async function loadMazeId() {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'maze-width': 15,
      'maze-height': 15,
      'maze-player-name': 'Rainbow Dash',
      difficulty: 0,
    }),
  };

  const response = await fetch(URL, requestOptions);

  if (response.status === 200) {
    const result = await response.json();
    return result;
  } else {
    throw new Error(response.statusText);
  }
}

export const loadMaze = async (id) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${URL}/${id}/print`, requestOptions);

  if (response.status === 200) {
    const result = await response.text();
    return result;
  } else {
    throw new Error(response.statusText);
  }
};

export const setMove = async (val, mazeId) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      direction: val,
    }),
  };

  const response = await fetch(`${URL}/${mazeId}`, requestOptions);
  const result = await response.json();
  return result;
};
