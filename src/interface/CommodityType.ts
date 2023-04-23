export default interface CommodityType {
  tid: number;
  typeName: string;
  ptid: number;
  img: string;
  commodityTypes: CommodityType[];
}
