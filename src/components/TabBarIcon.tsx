import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  let iconName = 'home';

  switch (route) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Lessons':
      iconName = 'school';
      break;
    case 'Dictionary':
      iconName = 'book';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'home';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon;


