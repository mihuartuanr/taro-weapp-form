export default function (number) {
  const str = String(number);
  const isDouble = str.includes('.');
  let intStr = str, decimalStr = '';
  if (isDouble) {
    const arr = str.split('.');
    intStr = arr[0];
    decimalStr = arr[1];
  }
  intStr = [].reduceRight.call(intStr, (sum, item, idx) => {
    const unit = intStr.length - 1 - idx;
    if (unit !== 0 && unit % 3 === 0) {
      sum = `${item},${sum}`
    } else {
      sum = `${item}${sum}`
    }
    return sum;
  }, '')
  return intStr + (decimalStr ? `.${decimalStr}` : '');
}

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatTimeLt = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('.');
};

const formatTimeHM = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute].map(formatNumber).join(':')}`;
};

const capitalFirstLetter = ([firstLetter, ...rest]) => {
  return firstLetter.toUpperCase() + rest.join('')
}
export {
  formatTimeHM,
  formatTimeLt,
  formatTime,
  capitalFirstLetter,
}
