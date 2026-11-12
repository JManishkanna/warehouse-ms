package com.wms.service;

import com.wms.model.StockHistory;
import com.wms.repository.StockHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DemandForecastService {
    private final StockHistoryRepository stockHistoryRepository;

    /**
     * Linear regression on daily outbound stock changes to forecast demand.
     */
    public Map<String, Object> forecastDemand(Long productId) {
        List<StockHistory> history = stockHistoryRepository.findByProductIdOrderByCreatedAtDesc(productId);
        
        Map<LocalDate, Integer> dailyUsage = new TreeMap<>();
        for (StockHistory sh : history) {
            if (sh.getDelta() < 0) {
                LocalDate date = sh.getCreatedAt().toLocalDate();
                dailyUsage.merge(date, Math.abs(sh.getDelta()), Integer::sum);
            }
        }
        
        if (dailyUsage.size() < 2) {
            Map<String, Object> result = new HashMap<>();
            result.put("productId", productId);
            result.put("message", "Insufficient historical dispatch data for regression forecasting (minimum 2 days required).");
            result.put("predictedDailyDemand", 0);
            result.put("trend", "STABLE");
            result.put("forecast", Collections.emptyList());
            return result;
        }

        List<LocalDate> dates = new ArrayList<>(dailyUsage.keySet());
        LocalDate baseDate = dates.get(0);
        double[] x = new double[dates.size()];
        double[] y = new double[dates.size()];
        for (int i = 0; i < dates.size(); i++) {
            x[i] = dates.get(i).toEpochDay() - baseDate.toEpochDay();
            y[i] = dailyUsage.get(dates.get(i));
        }
        
        double xMean = Arrays.stream(x).average().orElse(0);
        double yMean = Arrays.stream(y).average().orElse(0);
        double num = 0, den = 0;
        for (int i = 0; i < x.length; i++) {
            num += (x[i] - xMean) * (y[i] - yMean);
            den += (x[i] - xMean) * (x[i] - xMean);
        }
        double slope = den == 0 ? 0 : num / den;
        double intercept = yMean - slope * xMean;

        List<Map<String, Object>> forecast = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 1; i <= 7; i++) {
            LocalDate forecastDate = today.plusDays(i);
            double xVal = forecastDate.toEpochDay() - baseDate.toEpochDay();
            double predicted = Math.max(0, slope * xVal + intercept);
            Map<String, Object> point = new HashMap<>();
            point.put("date", forecastDate.toString());
            point.put("predictedDemand", Math.round(predicted));
            forecast.add(point);
        }

        double avgDailyDemand = Arrays.stream(y).average().orElse(0);

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("historicalDataPoints", dates.size());
        result.put("predictedDailyDemand", Math.round(avgDailyDemand));
        result.put("trend", slope > 0.1 ? "INCREASING" : slope < -0.1 ? "DECREASING" : "STABLE");
        result.put("forecast", forecast);
        return result;
    }
}
