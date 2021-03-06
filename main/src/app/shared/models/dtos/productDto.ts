import DateTimeFormat = Intl.DateTimeFormat;

export interface ProductDto {
  id: number;
  name: string;
  initialPrice: bigint;
  increaseAmount: bigint;
  registerDate: DateTimeFormat;
  startDate: DateTimeFormat;
  endDate: DateTimeFormat;
  approvementStatus: string;
  description: string;
  category: string;
  owner: string;
  productImages: [
    {
      link: string;
    }
  ];
  auctionStatus: string;
  baned: string;
}
