import React from 'react';
import { Input as ReactStrapInput } from 'reactstrap';
import cx from 'classnames';
import styles from './input.module.scss';

type Props = {
  className?: any,
  error?: boolean,
  [x:string]: any,
};

export const Input = ({
  className = '',
  error = false,
  ...rest
}: Props) => {
  return (
    <div
      className={cx(
        'control-wrapper',
        styles.inputControl,
        { [styles.error]: error },
        className,
      )}
    >
      <ReactStrapInput {...rest} />
      <span />
    </div>
  );
};
