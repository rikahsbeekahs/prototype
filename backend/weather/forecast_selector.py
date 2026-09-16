from datetime import datetime, timedelta
import re


def select_forecast(
    understanding_data,
    weather_data
):
    """
    Select only the forecast dates relevant to
    the user's requested date/period.

    Examples:
    today
    tomorrow
    day_after_tomorrow
    next 3 days
    next 5 days
    next 7 days
    YYYY-MM-DD
    """

    forecast = weather_data.get(
        "forecast",
        []
    )

    if not forecast:
        return []

    date_request = str(
        understanding_data.get(
            "date",
            ""
        )
    ).strip().lower()

    # --------------------------------------------------
    # Base date
    # The first forecast item represents today.
    # --------------------------------------------------

    try:
        base_date = datetime.strptime(
            forecast[0]["date"],
            "%Y-%m-%d"
        ).date()

    except (KeyError, ValueError):
        return forecast

    # --------------------------------------------------
    # TODAY
    # --------------------------------------------------

    if date_request in [
        "today",
        "current",
        "aaj"
    ]:
        start_date = base_date
        end_date = base_date

    # --------------------------------------------------
    # TOMORROW
    # --------------------------------------------------

    elif date_request in [
        "tomorrow",
        "kal"
    ]:
        start_date = base_date + timedelta(days=1)
        end_date = start_date

    # --------------------------------------------------
    # DAY AFTER TOMORROW
    # --------------------------------------------------

    elif date_request in [
        "day_after_tomorrow",
        "day after tomorrow",
        "parso"
    ]:
        start_date = base_date + timedelta(days=2)
        end_date = start_date

    # --------------------------------------------------
    # NEXT N DAYS
    # Examples:
    # next 3 days
    # next 5 days
    # next 7 days
    # --------------------------------------------------

    else:

        match = re.search(
            r"(?:next|for)\s*(\d+)\s*days?",
            date_request
        )

        if match:

            number_of_days = int(
                match.group(1)
            )

            # Limit to available forecast
            # and prevent unreasonable requests.
            number_of_days = max(
                1,
                min(number_of_days, 7)
            )

            start_date = (
                base_date + timedelta(days=1)
            )

            end_date = (
                start_date
                + timedelta(days=number_of_days - 1)
            )

        # --------------------------------------------------
        # EXPLICIT DATE
        # Example:
        # 2026-09-14
        # --------------------------------------------------

        elif re.fullmatch(
            r"\d{4}-\d{2}-\d{2}",
            date_request
        ):

            try:
                start_date = datetime.strptime(
                    date_request,
                    "%Y-%m-%d"
                ).date()

                end_date = start_date

            except ValueError:
                return forecast

        # --------------------------------------------------
        # UNKNOWN / GENERAL FORECAST
        # --------------------------------------------------

        else:
            return forecast

    # --------------------------------------------------
    # FILTER FORECAST
    # --------------------------------------------------

    selected_forecast = []

    for day in forecast:

        try:
            forecast_date = datetime.strptime(
                day["date"],
                "%Y-%m-%d"
            ).date()

        except (KeyError, ValueError):
            continue

        if start_date <= forecast_date <= end_date:

            selected_forecast.append(
                day
            )

    return selected_forecast