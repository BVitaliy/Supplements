import { AnimationController, Animation } from '@ionic/angular';

export const enterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const animationController = new AnimationController();

  if (opts.direction === 'forward') {
    return animationController.create().addElement(opts.enteringEl).duration(300).easing('ease-in').fromTo('opacity', 0, 1);
  } else {
    const enteringAnimation = animationController.create()
    .addElement(opts.enteringEl).duration(300).easing('ease-in').fromTo('opacity', 0, 1);
    const leavingAnimation = animationController.create()
    .addElement(opts.leavingEl).duration(300).easing('ease-out').fromTo('opacity', 1, 0);
    return animationController.create().addAnimation([enteringAnimation, leavingAnimation]);
  }
};

export const enterToastAnimation = (baseEl: HTMLElement): Animation => {
  const wrapperElem = baseEl.querySelector('.popover-wrapper') as HTMLElement;
  wrapperElem.style.opacity = '1';

  const animationController = new AnimationController();
  return animationController.create().addElement(baseEl).duration(400).easing('cubic-bezier(0.18, 0.89, 0.32, 1.1)')
    .keyframes([
      { opacity: '0.5', transform: `translateY(${baseEl.clientHeight}px)` },
      { opacity: '1', transform: 'translateY(0)' }
    ]);
};

export const leaveToastAnimation = (baseEl: HTMLElement): Animation => {
  const wrapperElem = baseEl.querySelector('.popover-wrapper') as HTMLElement;
  wrapperElem.style.opacity = '1';

  const animationController = new AnimationController();
  return animationController.create().addElement(baseEl).duration(400).easing('ease-out')
    .keyframes([
      { opacity: '1', transform: 'translateY(0)' },
      { opacity: '0', transform: `translateY(${baseEl.clientHeight}px)` }
    ]);
};
