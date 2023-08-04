/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators,
} from "@storybook/react-native";

global.STORIES = [
  {
    titlePrefix: "",
    directory: "./src",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      "^\\.[\\\\/](?:src(?:[\\\\/](?!\\.)(?:(?:(?!(?:^|[\\\\/])\\.).)*?)[\\\\/]|[\\\\/]|$)(?!\\.)(?=.)[^\\\\/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$",
  },
];

import "@storybook/addon-ondevice-notes/register";
import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-backgrounds/register";
import "@storybook/addon-ondevice-actions/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require("react-native").LogBox.ignoreLogs([
      "`clearDecorators` is deprecated and will be removed in Storybook 7.0",
    ]);
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators();
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return {
    "./src/components/common/Dialog/Dialog.stories.tsx": require("../src/components/common/Dialog/Dialog.stories.tsx"),
    "./src/components/common/Icon/Icon.stories.tsx": require("../src/components/common/Icon/Icon.stories.tsx"),
    "./src/components/common/Text/Text.stories.tsx": require("../src/components/common/Text/Text.stories.tsx"),
    "./src/components/home/cards/EventRowCard/EventRowCard.stories.tsx": require("../src/components/home/cards/EventRowCard/EventRowCard.stories.tsx"),
    "./src/components/suspense/loading/CommonLoading/CommonLoading.stories.tsx": require("../src/components/suspense/loading/CommonLoading/CommonLoading.stories.tsx"),
    "./src/components/suspense/skeleton/AlertCardSkeleton/AlertCardSkeleton.stories.tsx": require("../src/components/suspense/skeleton/AlertCardSkeleton/AlertCardSkeleton.stories.tsx"),
    "./src/components/suspense/skeleton/CarouselCardSkeleton/CarouselCardSkeleton.stories.tsx": require("../src/components/suspense/skeleton/CarouselCardSkeleton/CarouselCardSkeleton.stories.tsx"),
    "./src/components/suspense/skeleton/EventCardSkeleton/EventCardSkeleton.stories.tsx": require("../src/components/suspense/skeleton/EventCardSkeleton/EventCardSkeleton.stories.tsx"),
    "./src/components/suspense/skeleton/EventRowCardSkeleton/EventRowCardSkeleton.stories.tsx": require("../src/components/suspense/skeleton/EventRowCardSkeleton/EventRowCardSkeleton.stories.tsx"),
    "./src/components/suspense/skeleton/MapEventCardSkeleton/MapEventCardSkeleton.stories.tsx": require("../src/components/suspense/skeleton/MapEventCardSkeleton/MapEventCardSkeleton.stories.tsx"),
    "./src/components/suspense/skeleton/PosterCarouselSkeleton/PosterCarouselSkeleton.stories.tsx": require("../src/components/suspense/skeleton/PosterCarouselSkeleton/PosterCarouselSkeleton.stories.tsx"),
    "./src/navigators/BottomTabNavigator.stories.tsx": require("../src/navigators/BottomTabNavigator.stories.tsx"),
    "./src/screens/authorize/joins/InterestFieldScreen/InterestFieldScreen.stories.tsx": require("../src/screens/authorize/joins/InterestFieldScreen/InterestFieldScreen.stories.tsx"),
    "./src/screens/authorize/joins/UserInfoScreen/UserInfoScreen.stories.tsx": require("../src/screens/authorize/joins/UserInfoScreen/UserInfoScreen.stories.tsx"),
    "./src/screens/eventMap/EventMapScreen/EventMapScreen.stories.tsx": require("../src/screens/eventMap/EventMapScreen/EventMapScreen.stories.tsx"),
    "./src/screens/user/ScrapScreen/ScrapScreen.stories.tsx": require("../src/screens/user/ScrapScreen/ScrapScreen.stories.tsx"),
  };
};

configure(getStories, module, false);
