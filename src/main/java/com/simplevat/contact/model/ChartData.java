package com.simplevat.contact.model;

import com.simplevat.utils.DateUtils;


/*@Getter
@Setter*/
public class ChartData implements Comparable<ChartData> {
	
	public ChartData(int month_, int year_, Number amount_) {
		this.month = month_;
		this.year = year_;
		this.amount = amount_;
	}

	private int month;
	private int year;
	private Number amount;
	@Override
	public int compareTo(ChartData chartData) {
		if (chartData == null) return 1;
		
		if (this.getYear() == chartData.getYear()) {
			return (this.getMonth() - chartData.getMonth());
		}else {
			return (this.getYear() - chartData.getYear());
		}
	}
	
	public String getKey() {
		String key = DateUtils.getMonthForInt(this.month) +  "-" + String.valueOf(this.year).substring(2, 4);
		return key;
	}
	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public Number getAmount() {
		return amount;
	}

	public void setAmount(Number amount) {
		this.amount = amount;
	}
	@Override
	public boolean equals(Object o) {
	    if(o == null)                return false;
	    if(!(o instanceof ChartData)) return false;	
	    
		ChartData chartData = (ChartData) o;
		return this.getYear() == chartData.getYear() && this.getMonth() == chartData.getMonth();
	}

}
