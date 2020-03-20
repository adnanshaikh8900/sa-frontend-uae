package com.simplevat.util;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.formula.functions.Count;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.mysql.fabric.xmlrpc.base.Array;
import com.simplevat.model.ChartData;
import com.simplevat.service.report.model.BankAccountTransactionReportModel;

import net.bytebuddy.asm.Advice.Return;
import springfox.documentation.spring.web.json.Json;

@Component
public class ChartUtil {

	public Map<Object, Number> getCashMap(List<Object[]> rows, Integer count) {
		Map<Object, Number> cashMap = new LinkedHashMap<>(0);
		if (rows == null || rows.size() == 0) {
			return cashMap;
		}
		List<ChartData> chartDatas = convert(rows);
		Collections.sort(chartDatas);

		chartDatas = populateForAlltheMonths(chartDatas, count);

		for (ChartData chartData : chartDatas) {
			cashMap.put(chartData.getKey(), chartData.getAmount());
		}
		return cashMap;
	}

	private List<ChartData> convert(List<Object[]> rows) {
		List<ChartData> chartDatas = new ArrayList<ChartData>();
		for (Object[] row : rows) {
			String[] transactionDate = ((String) row[1]).split("-");
			ChartData chartData = new ChartData(Integer.parseInt(transactionDate[0]) - 1,
					Integer.parseInt(transactionDate[1]), (Number) row[0]);
			chartDatas.add(chartData);
		}

		return chartDatas;
	}

	public List<BankAccountTransactionReportModel> convertToTransactionReportModel(List<Object[]> rows) {
		List<BankAccountTransactionReportModel> list = new ArrayList<>();
		for (Object[] row : rows) {
			BankAccountTransactionReportModel model = new BankAccountTransactionReportModel();
			model.setAmount((BigDecimal) row[0]);
			model.setDate(localeDateTimeToDate((LocalDateTime) row[1]));
			model.setReference((String) row[2]);
			model.setType("TYPE-TBD");
			model.setTransaction("TRANSACTION-TBD");

			list.add(model);
		}

		return list;

	}

	public int addAmount(List<Object[]> rows) {
		int amount = 0;
		List<ChartData> chartDatas = convert(rows);
		for (ChartData chartData : chartDatas) {
			amount = amount + chartData.getMonth();
		}
		return amount;
	}

	private List<ChartData> populateForAlltheMonths(List<ChartData> chartDatas, Integer count) {
		List<ChartData> emptyChartDatas = getEmptyChartData(count);
		if (chartDatas == null || chartDatas.size() == 0) {
			return emptyChartDatas;
		}
		for (ChartData emptyChartData : emptyChartDatas) {
			for (ChartData chartData : chartDatas) {
				if (emptyChartData.equals(chartData)) {
					emptyChartData.setAmount(chartData.getAmount());
					break;
				}
			}
		}
		return emptyChartDatas;

	}

	public Calendar getStartDate(int calendarField, int value) {
		Calendar prevYear = Calendar.getInstance();
		prevYear.add(calendarField, value);
		prevYear.set(Calendar.DAY_OF_MONTH, 1);
		prevYear.add(Calendar.MONTH, 1);
		return prevYear;
	}

	public Calendar getEndDate() {
		Calendar preMonth = Calendar.getInstance();
		preMonth.set(Calendar.DAY_OF_MONTH, 1);
		preMonth.add(Calendar.MONTH, 1);
		preMonth.add(Calendar.DAY_OF_MONTH, -1);
		return preMonth;
	}

	private List<ChartData> getEmptyChartData(Integer count) {
		List<ChartData> emptyChartDatas = new ArrayList<ChartData>();
		for (int i = 0; i < count; i++) {
			Calendar calendar = getStartDate(Calendar.MONTH, -count);
			calendar.add(Calendar.MONTH, i);
			ChartData chartData = new ChartData(calendar.get(Calendar.MONTH), calendar.get(Calendar.YEAR), 0);
			emptyChartDatas.add(chartData);
		}
		return emptyChartDatas;
	}

	public Date modifyDate(Date date, int calendarField, int value) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(calendarField, value);
		return calendar.getTime();
	}

	public int getMaxValue(Map<Object, Number> data) {
		List<Number> list = new ArrayList(data.values());
		Number max = 0;
		for (int i = 0; i < list.size(); i++) {
			Number number = list.get(i);
			if (number != null) {
				if (number.doubleValue() > max.doubleValue()) {
					max = number;
				}
			}
		}
		int maxValue;
		if (max.doubleValue() < 10) {
			maxValue = max.intValue() * 2;
		} else {
			maxValue = max.intValue() + max.intValue() / 5;
		}
		return maxValue;

	}

	public Date localeDateTimeToDate(LocalDateTime ldt) {
		ZonedDateTime zdt = ldt.atZone(ZoneId.systemDefault());
		Date output = Date.from(zdt.toInstant());
		return output;
	}

	public Object getCashFlow(Map<Object, Number> inflow, Map<Object, Number> outFlow) {
		Map<Object, Number> cashMap = new LinkedHashMap<>(0);
		if (inflow == null || inflow.size() == 0) {
			return cashMap;
		}

		List<Object> months = new ArrayList<>();
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> inflowMap = new HashMap<String, Object>();
		List<Number> inflowData = new ArrayList<>();
		List<Number> outflowData = new ArrayList<>();

		for (Object key : inflow.keySet()) {
			inflowData.add(inflow.get(key));
			outflowData.add(outFlow.get(key));
			months.add(key);
		}

		inflowMap.put("label", "Inflow");
		inflowMap.put("data", inflowData);
		inflowMap.put("sum", inflowData.stream().mapToInt(Number::intValue).sum());
		map.put("inflow", inflowMap);

		Map<String, Object> outflowMap = new HashMap<String, Object>();
		outflowMap.put("label", "Outflow");
		outflowMap.put("data", outflowData);
		outflowMap.put("sum", outflowData.stream().mapToInt(Number::intValue).sum());
		map.put("outflow", outflowMap);
		map.put("labels", months);
		return (map);
	}

}
