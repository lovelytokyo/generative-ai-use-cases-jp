import React from 'react';
import { BaseProps } from '../@types/common';
import Help from './Help';

type Props = BaseProps & {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  help?: string;
  onChange: (n: number) => void;
};

const RangeSlider: React.FC<Props> = (props) => {
  return (
    <div className={`${props.className ?? ''}`}>
      {props.label && (
        <div className="flex items-center">
          <label className="text-sm">{props.label}</label>
          {props.help && <Help className="ml-1" text={props.help} />}
        </div>
      )}
      <div className="flex gap-3">
        <input
          type="range"
          className=" w-full cursor-pointer "
          value={props.value}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={(e) => {
            props.onChange(Number.parseFloat(e.target.value));
          }}
        />
        <input
          className="w-32 rounded border-black/30"
          type="number"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onChange={(e) => {
            props.onChange(Number.parseFloat(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
