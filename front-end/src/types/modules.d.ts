declare module 'react-datepicker' {
  import { ComponentType } from 'react';
  
  interface DatePickerProps {
    selected?: Date | null;
    onChange: (date: Date | [Date | null, Date | null] | null, event?: React.SyntheticEvent) => void;
    startDate?: Date | null;
    endDate?: Date | null;
    selectsRange?: boolean;
    inline?: boolean;
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    placeholderText?: string;
    className?: string;
    calendarClassName?: string;
    wrapperClassName?: string;
    monthsShown?: number;
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    dropdownMode?: 'scroll' | 'select';
    isClearable?: boolean;
    customInput?: React.ReactElement;
  }
  
  const DatePicker: ComponentType<DatePickerProps>;
  export default DatePicker;
}

declare module 'react-leaflet' {
  import { ComponentType, ReactNode } from 'react';
  
  type LatLngTuple = [number, number];
  
  interface MapContainerProps {
    center: LatLngTuple;
    zoom: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    scrollWheelZoom?: boolean;
  }
  
  interface TileLayerProps {
    url: string;
    attribution?: string;
  }
  
  interface MarkerProps {
    position: LatLngTuple;
    children?: ReactNode;
  }
  
  interface PopupProps {
    children?: ReactNode;
  }
  
  interface LeafletMap {
    setView(center: LatLngTuple, zoom: number): this;
  }
  
  export const MapContainer: ComponentType<MapContainerProps>;
  export const TileLayer: ComponentType<TileLayerProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Popup: ComponentType<PopupProps>;
  export function useMap(): LeafletMap;
}

declare module 'leaflet' {
  export namespace Icon {
    export class Default {
      static prototype: { _getIconUrl?: unknown };
      static mergeOptions(options: Record<string, string>): void;
    }
  }
  
  const L: {
    Icon: typeof Icon;
  };
  
  export default L;
}
