package com.zyz.util;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@SuppressWarnings("all")
public class DataTransform {
	public static String getStartDayOfWeekNo(int year, int weekNo) {
		Calendar cal = getCalendarFormYear(year);
		cal.set(Calendar.WEEK_OF_YEAR, weekNo);
		return cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" + cal.get(Calendar.DAY_OF_MONTH);

	}

	public static String getEndDayOfWeekNo(int year, int weekNo) {
		Calendar cal = getCalendarFormYear(year);
		cal.set(Calendar.WEEK_OF_YEAR, weekNo);
		cal.add(Calendar.DAY_OF_WEEK, 6);
		return cal.get(Calendar.YEAR) + "-" + ((cal.get(Calendar.MONTH) + 1)<10?"0"+(cal.get(Calendar.MONTH) + 1):(cal.get(Calendar.MONTH) + 1)) + "-" + (cal.get(Calendar.DAY_OF_MONTH)<10?"0"+cal.get(Calendar.DAY_OF_MONTH):cal.get(Calendar.DAY_OF_MONTH));
	}

	private static Calendar getCalendarFormYear(int year) {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		cal.set(Calendar.YEAR, year);
		return cal;
	}

	private static long dayTime = 1000 * 60 * 60 * 24;

	private static String[] getDate(String date) {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
		Date parse = null;
		try {
			parse = sf.parse(date);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String[] dates = new String[7];
		for (int i = 0; i < 7; i++) {
			long time = parse.getTime() - dayTime * (6 - i);
			Date d = new Date(time);
			String format = sf.format(d);
			dates[i] = format;
		}
		return dates;
	}

	public static String[] getWeekDays(int year, int weekNo) {
		return getDate(getEndDayOfWeekNo(year, weekNo));
	}
	
	
	
	

}
