import 'dart:convert';
import 'package:http/http.dart' as http;

/// Global Tax API - Dart/Flutter SDK (v1.0.0)
/// Robust compliance for mobile and web apps.
class GTaxClient {
  final String apiKey;
  final String baseUrl;

  GTaxClient({
    required this.apiKey,
    this.baseUrl = '/api',
  });

  Future<Map<String, dynamic>> _request(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
  }) async {
    final response = await (method == 'GET' 
      ? http.get(Uri.parse('$baseUrl$endpoint'), headers: _headers)
      : http.post(Uri.parse('$baseUrl$endpoint'), headers: _headers, body: jsonEncode(body)));

    if (response.statusCode != 200) {
      throw Exception('GTax API Error: ${response.body}');
    }

    return jsonDecode(response.body);
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  };

  /// Simple Tax Rate Lookup
  /// [country] is ISO Alpha-2 (e.g. US, KR, JP)
  /// [state] is required only for the US (e.g. CA, NY)
  Future<GTaxRate> lookupRate(String country, {String? state}) async {
    final params = {'country': country};
    if (state != null) params['state'] = state;
    
    final query = Uri(queryParameters: params).query;
    final data = await _request('/lookup?$query');
    return GTaxRate.fromJson(data);
  }

  /// Comprehensive Compliance Calculation
  Future<GTaxResult> calculate({
    required String buyerLoc,
    required double amount,
    String? buyerState,
    double? annualSales,
    String productType = 'digital_service',
  }) async {
    final data = await _request('/calculate', method: 'POST', body: {
      'buyer_loc': buyerLoc,
      'buyer_state': buyerState,
      'amount': amount,
      'annual_sales': annualSales,
      'product_type': productType,
    });
    return GTaxResult.fromJson(data);
  }
}

class GTaxRate {
  final String country;
  final String? state;
  final double rate;

  GTaxRate({required this.country, this.state, required this.rate});

  factory GTaxRate.fromJson(Map<String, dynamic> json) => GTaxRate(
    country: json['country'],
    state: json['state'],
    rate: json['rate'].toDouble(),
  );
}

class GTaxResult {
  final double taxAmount;
  final bool nexusHit;

  GTaxResult({required this.taxAmount, required this.nexusHit});

  factory GTaxResult.fromJson(Map<String, dynamic> json) {
    final res = json['result'];
    return GTaxResult(
      taxAmount: res['tax_amount'].toDouble(),
      nexusHit: res['nexus_hit'] ?? false,
    );
  }
}
